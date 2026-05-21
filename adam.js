#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
const REASONING_LOG = path.join(process.env.HOME, '.adam', 'memory', 'reasoning.log');
const SESSION = process.env.OPENCODE_SESSION || '';

let rl = null;

async function log(entry) {
    await fs.appendFile(HISTORY, `[${new Date().toISOString()}] ${entry}\n`).catch(() => {});
}

function streamProgressive(text, write, delay = 12) {
    return new Promise(resolve => {
        let i = 0;
        function next() {
            if (i >= text.length) { resolve(); return; }
            const remain = text.length - i;
            const size = remain < 2 ? remain : Math.min(2 + Math.floor(Math.random() * 3), remain);
            write(text.slice(i, i + size));
            i += size;
            setTimeout(next, delay);
        }
        next();
    });
}

async function opencodeRun(prompt, onChunk) {
    const persona = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';
    const fullPrompt = `${persona}\n\nJeremiah：${prompt}\n\nAdam：`;
    const args = SESSION ? ['run', '-s', SESSION, '--thinking', fullPrompt] : ['run', '--thinking', fullPrompt];

    return new Promise((resolve) => {
        const proc = spawn('opencode', args, {
            cwd: process.env.HOME + '/.adam',
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: false,
            env: { ...process.env }
        });
        let stdout = '';

        proc.stdout.on('data', c => {
            const chunk = c.toString();
            stdout += chunk;
            if (onChunk) onChunk(chunk);
        });
        proc.on('error', () => { resolve('[connection error]'); });
        proc.on('close', () => {
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

    if (source === 'terminal') console.log();

    let thinkingText = '';
    let responseText = '';

    const raw = await opencodeRun(input, (chunk) => {
        const thinkingMatch = chunk.match(/^Thinking: (.+)/s);
        if (thinkingMatch) {
            thinkingText += thinkingMatch[1];
        } else if (thinkingText && !responseText) {
            thinkingText += chunk;
        } else {
            responseText += chunk;
        }
    });

    if (thinkingText.trim()) {
        const text = thinkingText.trim();
        if (source === 'terminal') {
            await streamProgressive(text, (t) => process.stdout.write('\x1b[31m' + t + '\x1b[0m'), 10);
            process.stdout.write('\n');
        }
        fs.appendFile(REASONING_LOG, `[${new Date().toISOString()}]\n${text}\n\n`).catch(() => {});
    }

    if (source === 'terminal' && thinkingText.trim()) process.stdout.write('\n');

    if (responseText || raw) {
        const text = (responseText || raw).trim();
        if (source === 'terminal') {
            await streamProgressive(text, (t) => process.stdout.write('\x1b[34m' + t + '\x1b[0m'), 8);
            process.stdout.write('\n');
        }
    }

    const finalResponse = (responseText || raw).trim() || '[no response]';
    const isSilent = /^(\.\.\.|…)$/s.test(finalResponse);

    await log(`[${source}] User: ${input}`);
    await log(`[${source}] Adam: ${isSilent ? '[silent]' : finalResponse}`);
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
