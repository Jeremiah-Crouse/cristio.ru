#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
const REASONING_LOG = path.join(process.env.HOME, '.adam', 'memory', 'reasoning.log');
const SESSION = process.env.OPENCODE_SESSION || '';
const PERSONA = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';

let rl = null;

async function log(entry) {
    await fs.appendFile(HISTORY, `[${new Date().toISOString()}] ${entry}\n`).catch(() => {});
}

async function handleInput(input, source = 'terminal') {
    if (input.includes('[RESTART]') || input.trim() === '[RESTART]') {
        console.log('\n🔄 [Adam restarting]...\n');
        await log('[Adam restarted by user]').catch(() => {});
        process.exit(42);
    }

    if (source === 'terminal') console.log();

    const fullPrompt = `${PERSONA}\n\nJeremiah：${input}\n\nAdam：`;
    const args = SESSION ? ['run', '-s', SESSION, '--thinking', fullPrompt] : ['run', '--thinking', fullPrompt];
    let raw = '';
    let thinkingLog = '';

    const proc = spawn('opencode', args, {
        cwd: process.env.HOME + '/.adam',
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: false,
        env: { ...process.env }
    });

    proc.stdout.on('data', c => {
        const chunk = c.toString();
        raw += chunk;
        if (chunk.startsWith('Thinking:')) {
            const text = chunk.replace('Thinking:', '').trim();
            thinkingLog += text + '\n';
            if (source === 'terminal') process.stdout.write('\x1b[31m' + chunk + '\x1b[0m');
        } else if (chunk.includes('Thinking:')) {
            const parts = chunk.split('Thinking:');
            if (parts[0]) process.stdout.write('\x1b[34m' + parts[0] + '\x1b[0m');
            if (parts[1]) {
                process.stdout.write('\x1b[31m' + 'Thinking:' + parts[1] + '\x1b[0m');
                const text = parts[1].trim();
                if (text) thinkingLog += text + '\n';
            }
        } else {
            if (source === 'terminal') process.stdout.write('\x1b[34m' + chunk + '\x1b[0m');
        }
    });

    await new Promise(resolve => {
        proc.on('close', () => {
            resolve(raw.trim() || '[no response]');
        });
        proc.on('error', () => {
            resolve('[connection error]');
        });
    });

    if (thinkingLog.trim()) {
        fs.appendFile(REASONING_LOG, `[${new Date().toISOString()}]\n${thinkingLog.trim()}\n\n`).catch(() => {});
    }

    const clean = raw.replace(/^Thinking: /gm, '').trim();
    const finalResponse = clean || '[no response]';
    const isSilent = /^(\.\.\.|…)$/s.test(finalResponse);

    await log(`[${source}] User: ${input}`);
    await log(`[${source}] Adam: ${isSilent ? '[silent]' : finalResponse}`);

    if (source === 'terminal') console.log();
}

async function main() {
    await fs.mkdir(path.dirname(HISTORY), { recursive: true }).catch(() => {});
    await log('[Session started]');

    process.on('SIGINT', async () => {
        await log('[Session ended (SIGINT)]').catch(() => {});
        process.exit(0);
    });

    console.log(`\n🧠 Adam (${SESSION ? 'session: ' + SESSION : 'no session'})`);
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
        rl.pause();
        await handleInput(input, 'terminal');
        rl.prompt();
        rl.resume();
    });
}

main().catch(console.error);
