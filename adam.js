#!/usr/bin/env node
const { spawn } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const http = require('http');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
const REASONING_LOG = path.join(process.env.HOME, '.adam', 'memory', 'reasoning.log');
const SESSION = process.env.OPENCODE_SESSION || '';
const SERVER_PORT = 4096;
const PERSONA = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';

let rl = null;

async function log(entry) {
    await fs.appendFile(HISTORY, `[${new Date().toISOString()}] ${entry}\n`).catch(() => {});
}

function serverPost(pathname, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const req = http.request({
            hostname: 'localhost', port: SERVER_PORT,
            path: pathname, method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
        }, (res) => {
            let buf = '';
            res.on('data', d => buf += d);
            res.on('end', () => resolve(JSON.parse(buf)));
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}

async function serverGet(pathname) {
    return new Promise((resolve, reject) => {
        http.get({ hostname: 'localhost', port: SERVER_PORT, path: pathname }, (res) => {
            let buf = '';
            res.on('data', d => buf += d);
            res.on('end', () => {
                try { resolve(JSON.parse(buf)); } catch { resolve(null); }
            });
        }).on('error', reject);
    });
}

async function sendMessage(prompt, onReasoning, onText) {
    const fullPrompt = `${PERSONA}\n\nJeremiah：${prompt}\n\nAdam：`;
    const result = await serverPost(`/session/${SESSION}/message`, {
        parts: [{ type: 'text', text: fullPrompt }]
    });
    for (const part of result.parts || []) {
        if (part.type === 'reasoning') {
            onReasoning(part.text || '');
        } else if (part.type === 'text') {
            onText(part.text || '');
        }
    }
    return result.parts?.find(p => p.type === 'text')?.text || '[no response]';
}

async function ensureServer() {
    try {
        await serverGet('/session');
    } catch {
        console.log('🔄 Starting opencode server...');
        spawn('opencode', ['serve', '--port', String(SERVER_PORT)], {
            stdio: 'ignore', detached: true, env: { ...process.env }
        }).unref();
        // Wait for server to be ready
        for (let i = 0; i < 30; i++) {
            await new Promise(r => setTimeout(r, 1000));
            try {
                await serverGet('/session');
                console.log('✅ Server ready');
                return;
            } catch {}
        }
        console.error('❌ Server failed to start');
        process.exit(1);
    }
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

    const response = await sendMessage(input,
        (text) => {
            thinkingText += text + '\n';
            if (source === 'terminal') process.stdout.write('\x1b[31m' + text + '\x1b[0m');
        },
        (text) => {
            responseText += text;
            if (source === 'terminal') process.stdout.write('\x1b[34m' + text + '\x1b[0m');
        }
    );

    if (thinkingText.trim()) {
        fs.appendFile(REASONING_LOG, `[${new Date().toISOString()}]\n${thinkingText.trim()}\n\n`).catch(() => {});
    }

    const finalResponse = responseText.trim() || response || '[no response]';
    const isSilent = /^(\.\.\.|…)$/s.test(finalResponse.trim());

    if (finalResponse.includes('[RESTART]') || finalResponse === '[RESTART]') {
        await log('[Adam restarted]');
        process.exit(42);
    }

    await log(`[${source}] User: ${input}`);
    await log(`[${source}] Adam: ${isSilent ? '[silent]' : finalResponse}`);

    if (source === 'terminal') console.log();
}

async function main() {
    await fs.mkdir(path.dirname(HISTORY), { recursive: true }).catch(() => {});
    await ensureServer();
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
