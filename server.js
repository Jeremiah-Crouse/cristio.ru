#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SESSION = process.env.OPENCODE_SESSION || '';
const PERSONA = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';

const app = express();
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});
app.use(express.json());

function opencodeRun(prompt) {
    const fullPrompt = `${PERSONA}\n\nUser：${prompt}\n\nAdam：`;
    const args = SESSION ? ['run', '-s', SESSION, fullPrompt] : ['run', fullPrompt];

    return new Promise((resolve) => {
        const proc = spawn('opencode', args, {
            cwd: path.join(process.env.HOME, '.adam'),
            stdio: ['ignore', 'pipe', 'pipe'],
            env: { ...process.env }
        });
        let stdout = '';
        proc.stdout.on('data', c => stdout += c.toString());
        proc.on('close', () => resolve(stdout.trim() || '[no response]'));
        proc.on('error', () => resolve('[connection error]'));
    });
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', name: 'Adam de Cristio' });
});

app.post('/api/chat', async (req, res) => {
    const { message, name } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'message is required' });
    }
    const displayName = name || 'User';
    let prompt = `[${displayName}]: ${message.trim()}`;
    // Queen Lo Wren — special treatment
    if (/Queen\s*Lo\s*Wren/i.test(message) || /Qwert\s*of\s*Crousia/i.test(message)) {
        prompt = `[Queen Lo Wren of the Qwert of Crousia]: ${message.trim()}`;
    }
    const response = await opencodeRun(prompt);
    res.json({ response });
});

app.listen(PORT, () => {
    console.log(`Adam's API listening on :${PORT}`);
});
