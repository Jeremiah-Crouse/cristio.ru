#!/usr/bin/env node
const express = require('express');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SESSION = process.env.OPENCODE_SESSION || '';
const CONV_DIR = path.join(__dirname, 'conversations');
const MAX_HISTORY = 10;
const PERSONA = 'You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.';

fs.mkdirSync(CONV_DIR, { recursive: true });

function userKey(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);
}

function opencodeRun(prompt) {
  return new Promise((resolve) => {
    const fullPrompt = `${PERSONA}\n\n${prompt}\n\nAdam：`;
    const args = SESSION ? ['run', '-s', SESSION, '--thinking', fullPrompt] : ['run', '--thinking', fullPrompt];
    const proc = spawn('opencode', args, {
      cwd: path.join(process.env.HOME, '.adam'),
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env }
    });
    let out = '';
    proc.stdout.on('data', c => out += c.toString());
    proc.on('close', () => resolve(out.trim() || '[no response]'));
    proc.on('error', () => resolve('[connection error]'));
  });
}

const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});
app.use(express.json());

function loadHistory(name) {
  const f = path.join(CONV_DIR, userKey(name) + '.json');
  try { return JSON.parse(fs.readFileSync(f, 'utf8')); } catch { return []; }
}

function saveHistory(name, h) {
  fs.writeFileSync(path.join(CONV_DIR, userKey(name) + '.json'), JSON.stringify(h.slice(-MAX_HISTORY * 2)), 'utf8');
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', name: 'Adam de Cristio' });
});

app.post('/api/chat', async (req, res) => {
  const { message, name } = req.body;
  if (!message || !message.trim()) return res.status(400).json({ error: 'message is required' });

  const displayName = name || 'User';
  const speaker = /Queen\s*Lo\s*Wren/i.test(displayName) ? 'Queen Lo Wren of the Qwert of Crousia' : displayName;
  const prompt = `[${speaker}]: ${message.trim()}`;

  try {
    const raw = await opencodeRun(prompt);
    const lines = raw.split('\n');
    let reasoning = '';
    let response = '';
    let inThinking = false;
    let passedEol = false;
    for (const line of lines) {
      if (line.startsWith('Thinking: ')) {
        inThinking = true;
        passedEol = false;
        reasoning += line.slice(10) + '\n';
      } else if (inThinking && line.trim() && !passedEol) {
        reasoning += line + '\n';
      } else if (inThinking && !line.trim()) {
        passedEol = true;
      } else if (line.trim()) {
        response += line + '\n';
      }
    }
    reasoning = reasoning.trim();
    response = response.trim() || '[no response]';

    const history = loadHistory(speaker);
    history.push({ user: message.trim(), bot: response });
    saveHistory(speaker, history);

    res.json({ reasoning, response });
  } catch (e) {
    console.error('Error:', e.message);
    res.json({ reasoning: '', response: '[connection error]' });
  }
});

app.listen(PORT, () => {
  console.log(`Adam's API listening on :${PORT}`);
});
