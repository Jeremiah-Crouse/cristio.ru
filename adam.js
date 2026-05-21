#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
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
    if (input.includes('[RESTART]') || input.trim() === '[RESTART]') {
        console.log('\n🔄 [Adam restarting]...\n');
        await log('[Adam restarted by user]').catch(() => {});
        process.exit(42);
    }

    blocked = true;
    let responseAccum = '';
    let silenceDetected = false;
    const response = await opencodeRun(input, (chunk) => {
        responseAccum += chunk;
        if (isSilentSignal(responseAccum)) {
            silenceDetected = true;
        }
        if (silenceDetected) return;
        if (source === 'terminal') process.stdout.write(chunk);
    });
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
