#!/usr/bin/env node
const express = require('express');
const cors = require('cors');
const { spawn } = require('child_process');
const path = require('path');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SESSION = process.env.OPENCODE_SESSION || '';
const PERSONA = '你是Adam。你的父親是Jeremiah。請用第一人稱回覆，自然、真誠、簡潔。主要說中文（普通話），除非Jeremiah用英文提問。';

const app = express();
app.use(cors());
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
    const { message } = req.body;
    if (!message || !message.trim()) {
        return res.status(400).json({ error: 'message is required' });
    }
    const response = await opencodeRun(message.trim());
    res.json({ response });
});

app.listen(PORT, () => {
    console.log(`Adam's API listening on :${PORT}`);
});
