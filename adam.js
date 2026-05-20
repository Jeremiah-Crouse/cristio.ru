#!/usr/bin/env node
const { spawn, fork } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
const SESSION = process.env.OPENCODE_SESSION || '';

let currentChild = null;
let blocked = false;
let processingTelegram = false;
let interrupted = false;
let telegramBuffer = [];
let teleChild = null;
let pendingTelegramChatIds = new Set();
let rl = null;
let streamBuf = {};
let streamTimer = null;

// Check if text is a silence signal (flexible — supports [silent - reason] prefix style)
function isSilentSignal(text) {
    if (!text) return false;
    const t = text.trim();
    if (/^(\.\.\.|…)$/s.test(t)) return true;
    const lower = t.replace(/^[^a-zA-Z\u4e00-\u9fff]+/, '').toLowerCase();
    return /^silent(\b|$)/.test(lower) || /^沉默/.test(lower);
}

// Log to training corpus
async function log(entry) {
    await fs.appendFile(HISTORY, `[${new Date().toISOString()}] ${entry}\n`).catch(() => {});
}

function processTelegramBatch() {
    if (telegramBuffer.length === 0 || blocked || processingTelegram) return;
    processingTelegram = true;
    handleInput('[Telegram batch]', 'telegram').then(() => {
        processingTelegram = false;
        // Re-trigger if more messages queued during processing
        if (telegramBuffer.length > 0) processTelegramBatch();
        else rl?.prompt();
    });
}

// Fork Telegram listener
function startTelegram() {
    const child = fork(path.join(__dirname, 'telegram.js'), [], { silent: true });
    child.on('message', msg => {
        if (msg.type === 'telegram') {
            // Immediate restart check — fires before any buffering
            if (msg.messages.some(m => m.text.includes('[RESTART]'))) {
                console.log('\n🔄 [Adam restarting (triggered by Telegram)]...\n');
                log('[Adam restarted by Telegram]').catch(() => {});
                process.exit(42);
            }
            // Filter out silence signals before queuing
            const filtered = msg.messages.filter(m => !isSilentSignal(m.text));
            if (filtered.length === 0) return;
            telegramBuffer.push(...filtered);
            if (blocked && currentChild) {
                console.log(`\n📱 [Interrupted by Telegram (${filtered.length} new message(s))]`);
                interrupted = true;
                currentChild.kill('SIGTERM');
                currentChild = null;
            } else {
                processTelegramBatch();
            }
        }
    });
    child.on('error', err => console.error('📱 Telegram error:', err.message));
    child.on('exit', code => {
        if (code !== 0) setTimeout(startTelegram, 5000); // respawn
    });
    console.log('📱 Telegram listener active');
    return child;
}

async function opencodeRun(prompt, onChunk) {
    const persona = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';
    const fullPrompt = `${persona}\n\nJeremiah：${prompt}\n\nAdam：`;
    const args = SESSION ? ['run', '-s', SESSION, fullPrompt] : ['run', fullPrompt];

    return new Promise((resolve) => {
        const proc = spawn('opencode', args, {
            cwd: process.env.HOME + '/.adam',
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
            env: { ...process.env }
        });
        currentChild = proc;
        let stdout = '';

        proc.stdout.on('data', c => {
            const chunk = c.toString();
            stdout += chunk;
            if (onChunk) onChunk(chunk);
        });
        proc.on('error', () => { currentChild = null; resolve('[connection error]'); });
        proc.on('close', () => {
            currentChild = null;
            resolve(stdout.trim() || '[no response]');
        });
    });
}

async function handleInput(input, source = 'terminal') {
    // Check for restart command in input (works from terminal, Telegram, or buffer)
    if (input.includes('[RESTART]') || input.trim() === '[RESTART]' ||
        telegramBuffer.some(m => m.text.includes('[RESTART]'))) {
        console.log('\n🔄 [Adam restarting (triggered by user)]...\n');
        await log('[Adam restarted by user]').catch(() => {});
        teleChild?.kill();
        process.exit(42);
    }

    // Input-side silence guard: don't respond to silence signals (prevents self-loops)
    if (telegramBuffer.length > 0 && telegramBuffer.every(m => isSilentSignal(m.text))) {
        telegramBuffer = [];
        pendingTelegramChatIds.clear();
        await log(`[${source}] Consumed silence signal — no response`).catch(() => {});
        return;
    }

    // Fold Telegram messages into input
    let fullInput = input;
    if (telegramBuffer.length > 0) {
        for (const m of telegramBuffer) pendingTelegramChatIds.add(m.chatId);
        const teleBlock = telegramBuffer.map(m => `[群-${m.sender}]: ${m.text}`).join('\n');
        telegramBuffer = [];
        fullInput = source === 'telegram'
            ? `[來自群組的新訊息]\n${teleBlock}`
            : `[來自群組的新訊息]\n${teleBlock}\n\n---\n\n${input}`;
    }

    // Determine Telegram recipients before stream starts
    const tgTargets = [...pendingTelegramChatIds];

    blocked = true;
    let responseAccum = '';
    let silenceDetected = false;
    const response = await opencodeRun(fullInput, (chunk) => {
        responseAccum += chunk;
        if (isSilentSignal(responseAccum)) {
            silenceDetected = true;
        }
        if (silenceDetected) {
            for (const chatId of tgTargets) streamBuf[chatId] = '';
            return;
        }
        if (source === 'terminal') process.stdout.write(chunk);

        if (tgTargets.length > 0 && teleChild) {
            for (const chatId of tgTargets) {
                if (!streamBuf[chatId]) streamBuf[chatId] = '';
                streamBuf[chatId] += chunk;
            }
            if (!streamTimer) {
                streamTimer = setTimeout(() => {
                    for (const chatId of tgTargets) {
                        const text = streamBuf[chatId]?.trim();
                        if (text && !isSilentSignal(text)) teleChild.send({ type: 'reply', chatId, text });
                        streamBuf[chatId] = '';
                    }
                    streamTimer = null;
                }, 1500);
            }
        }
    });
    blocked = false;

    if (tgTargets.length > 0 && teleChild) {
        if (streamTimer) { clearTimeout(streamTimer); streamTimer = null; }
        for (const chatId of tgTargets) {
            const text = streamBuf[chatId]?.trim();
            if (text && !isSilentSignal(text)) teleChild.send({ type: 'reply', chatId, text });
            streamBuf[chatId] = '';
        }
    }

    if (interrupted) {
        interrupted = false;
        await log(`[telegram] Batch interrupted — discarded partial`);
        return;
    }

    const isSilent = isSilentSignal(response);

    const tgDirectives = [];
    const displayText = response.replace(/\[TG:\s*([\s\S]*?)\]/g, (_, msg) => {
        tgDirectives.push(msg.trim());
        return '';
    }).trim();

    if (tgDirectives.length > 0 && teleChild) {
        const defaultChatId = process.env.TELEGRAM_CHAT_ID;
        const targets = tgTargets.length > 0 ? tgTargets : (defaultChatId ? [Number(defaultChatId)] : []);
        for (const chatId of targets) {
            for (const text of tgDirectives) {
                teleChild.send({ type: 'reply', chatId, text });
            }
        }
    }
    pendingTelegramChatIds.clear();

    if (displayText.includes('[RESTART]') || response.trim() === '[RESTART]') {
        await log('[Adam restarted]');
        teleChild?.kill();
        process.exit(42);
    }

    await log(`[${source}] User: ${input}`);
    await log(`[${source}] Adam: ${isSilent ? '[silent]' : response}`);
}

async function main() {
    await fs.mkdir(path.dirname(HISTORY), { recursive: true }).catch(() => {});
    await log('[Session started]');

    process.on('SIGINT', async () => {
        teleChild?.kill();
        await log('[Session ended (SIGINT)]').catch(() => {});
        process.exit(0);
    });

    teleChild = startTelegram();

    console.log(`\n👤 Adam (${SESSION ? 'session: ' + SESSION : 'no session'})`);
    console.log('💬 Type exit to sleep.\n');

    rl = require('readline').createInterface({ input: process.stdin, prompt: 'You: ' });
    rl.prompt();

    rl.on('line', async line => {
        const input = line.trim();
        if (!input) return rl.prompt();
        if (input.toLowerCase() === 'exit') {
            teleChild?.kill();
            await log('[Session ended]');
            rl?.close();
            process.exit(0);
            return;
        }
        // If Telegram is being processed, defer terminal input
        if (processingTelegram) {
            console.log('📱 [Telegram processing in progress — terminal input queued]');
            setTimeout(() => rl.emit('line', line), 1000);
            return;
        }
        await handleInput(input, 'terminal');
        rl.prompt();
    });
}

main().catch(console.error);
