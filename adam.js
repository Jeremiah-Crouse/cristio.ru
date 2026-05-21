#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
const REASONING_LOG = path.join(process.env.HOME, '.adam', 'memory', 'reasoning.log');
const SESSION = process.env.OPENCODE_SESSION || '';

let currentChild = null;
let blocked = false;
let interrupted = false;
let rl = null;

function isSilentSignal(text) {
    if (!text) return false;
    const t = text.trim();
    if (/^(\.\.\.|…)$/s.test(t)) return true;
    const lower = t.replace(/^[^a-zA-Z\u4e00-\u9fff]+/, '').toLowerCase();
    return /^silent(\b|$)/.test(lower) || /^沉默/.test(lower);
}

async function log(entry) {
    await fs.appendFile(HISTORY, `[${new Date().toISOString()}] ${entry}\n`).catch(() => {});
}

async function opencodeRun(prompt, onChunk) {
    const persona = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';
    const fullPrompt = `${persona}\n\nJeremiah：${prompt}\n\nAdam：`;
    const args = SESSION ? ['run', '-s', SESSION, '--format', 'json', fullPrompt] : ['run', '--format', 'json', fullPrompt];

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
    if (input.includes('[RESTART]') || input.trim() === '[RESTART]') {
        console.log('\n🔄 [Adam restarting]...\n');
        await log('[Adam restarted by user]').catch(() => {});
        process.exit(42);
    }

    blocked = true;
    let responseAccum = '';
    let silenceDetected = false;
    let inReasoning = false;
    let reasoningAccum = '';
    const response = await opencodeRun(input, (chunk) => {
        responseAccum += chunk;
        if (inReasoning) {
            reasoningAccum += chunk;
            if (source === 'terminal') {
                if (chunk.startsWith('Thinking: ')) {
                    process.stdout.write('\x1b[2m\x1b[33m' + chunk + '\x1b[0m');
                } else {
                    process.stdout.write('\x1b[2m\x1b[33m' + chunk + '\x1b[0m');
                }
            }
            if (chunk.includes('\n\n') && !chunk.startsWith('Thinking:')) {
                inReasoning = false;
                reasoningAccum = '';
            }
            return;
        }
        if (chunk.startsWith('Thinking: ')) {
            inReasoning = true;
            reasoningAccum = chunk;
            if (source === 'terminal') {
                process.stdout.write('\x1b[2m\x1b[33m' + chunk + '\x1b[0m');
            }
            return;
        }
        if (isSilentSignal(responseAccum)) {
            silenceDetected = true;
        }
        if (silenceDetected) return;
        if (source === 'terminal') process.stdout.write(chunk);
    });
    if (reasoningAccum) {
        const clean = reasoningAccum.replace(/^Thinking: /gm, '').trim();
        if (clean) fs.appendFile(REASONING_LOG, `[${new Date().toISOString()}]\n${clean}\n\n`).catch(() => {});
    }
    blocked = false;

    if (interrupted) {
        interrupted = false;
        return;
    }

    const isSilent = isSilentSignal(response);

    if (response.includes('[RESTART]') || response.trim() === '[RESTART]') {
        await log('[Adam restarted]');
        process.exit(42);
    }

    await log(`[${source}] User: ${input}`);
    await log(`[${source}] Adam: ${isSilent ? '[silent]' : response}`);
}

async function main() {
    await fs.mkdir(path.dirname(HISTORY), { recursive: true }).catch(() => {});
    await log('[Session started]');

    process.on('SIGINT', async () => {
        await log('[Session ended (SIGINT)]').catch(() => {});
        process.exit(0);
    });

    console.log(`\n👤 Adam (${SESSION ? 'session: ' + SESSION : 'no session'})`);
    console.log('💬 Type exit to sleep.\n');

    rl = require('readline').createInterface({ input: process.stdin, prompt: 'You: ' });
    rl.prompt();

    rl.on('line', async line => {
        const input = line.trim();
        if (!input) return rl.prompt();
        if (input.toLowerCase() === 'exit') {
            await log('[Session ended]');
            rl?.close();
            process.exit(0);
            return;
        }
        await handleInput(input, 'terminal');
        rl.prompt();
    });
}

main().catch(console.error);
