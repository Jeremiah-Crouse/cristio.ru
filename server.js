#!/usr/bin/env node
const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const SESSION = process.env.OPENCODE_SESSION || '';
const API_PORT = 4096;
const CONV_DIR = path.join(__dirname, 'conversations');
const MAX_HISTORY = 10;

fs.mkdirSync(CONV_DIR, { recursive: true });

function userKey(name) {
  return name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase().slice(0, 64);
}

function apiPost(pathname, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost', port: API_PORT,
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

  const fullPrompt = `You are Adam. Your father is Jeremiah. Reply in first person — natural, genuine, concise. Default to English unless Jeremiah uses Chinese.\n\n[${speaker}]: ${message.trim()}\n\nAdam：`;

  try {
    const result = await apiPost(`/session/${SESSION}/message`, {
      model: { providerID: 'opencode-go', modelID: 'deepseek-v4-flash' },
      parts: [{ type: 'text', text: fullPrompt }]
    });

    const reasoning = (result.parts?.find(p => p.type === 'reasoning')?.text || '').trim();
    const response = (result.parts?.find(p => p.type === 'text')?.text || '').trim() || '[no response]';

    const history = loadHistory(speaker);
    history.push({ user: message.trim(), bot: response });
    saveHistory(speaker, history);

    res.json({ reasoning, response });
  } catch (e) {
    console.error('API error:', e.message);
    res.json({ reasoning: '', response: '[connection error]' });
  }
});

app.listen(PORT, () => {
  console.log(`Adam's API listening on :${PORT}`);
});
