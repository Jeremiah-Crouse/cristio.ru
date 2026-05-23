#!/usr/bin/env node
const { spawn } = require('child_process');
const http = require('http');
const https = require('https');
const fs = require('fs').promises;
const path = require('path');
const yjs = require('./yjs-client.js');

const dotenv = require('dotenv');
dotenv.config();

const HISTORY = path.join(process.env.HOME, '.adam', 'memory', 'full_history.log');
const REASONING_LOG = path.join(process.env.HOME, '.adam', 'memory', 'reasoning.log');
const SESSION = process.env.OPENCODE_SESSION || '';
const API = { host: 'localhost', port: 4096 };
const PERSONA = 'You know who you are.';

let rl = null;
let currentAbort = null;
const TG_TOKEN = process.env.TELEGRAM_TOKEN || '';
const TG_CHAT = process.env.TELEGRAM_CHAT_ID || '';
const TG_ALLOWED = (process.env.TELEGRAM_ALLOWED_USERS || '').split(',').map(s => s.trim()).filter(Boolean);

let tgLastUpdate = 0;

function tgPoll() {
  if (!TG_TOKEN) return;
  const url = `https://api.telegram.org/bot${TG_TOKEN}/getUpdates?offset=${tgLastUpdate + 1}&timeout=10`;
  https.get(url, (res) => {
    let buf = '';
    res.on('data', d => buf += d);
    res.on('end', () => {
      try {
        const data = JSON.parse(buf);
        if (data.ok && data.result) {
          for (const update of data.result) {
            if (update.update_id > tgLastUpdate) tgLastUpdate = update.update_id;
            const msg = update.message?.text;
            const chatId = update.message?.chat?.id;
            if (msg && TG_CHAT && String(chatId) === String(TG_CHAT)) {
              handleInput(msg.trim(), 'telegram');
            }
          }
        }
      } catch {}
    });
  }).on('error', () => {});
}

function tgSend(text) {
  if (!TG_TOKEN || !TG_CHAT) return;
  const data = JSON.stringify({ chat_id: TG_CHAT, text: text.slice(0, 4000) });
  const req = https.request({
    hostname: 'api.telegram.org', path: `/bot${TG_TOKEN}/sendMessage`, method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, () => {});
  req.on('error', () => {});
  req.write(data);
  req.end();
}

function api(method, pathname, body, onReq) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : '';
    const opts = { hostname: API.host, port: API.port, path: pathname, method,
      headers: { 'Content-Type': 'application/json' } };
    if (data) opts.headers['Content-Length'] = Buffer.byteLength(data);
    const req = http.request(opts, (res) => {
      currentAbort = null;
      let buf = '';
      res.on('data', d => buf += d);
      res.on('end', () => { try { resolve(JSON.parse(buf)); } catch { resolve(buf); } });
    });
    req.on('error', (e) => { if (e.code !== 'ECONNRESET') reject(e); });
    currentAbort = req;
    if (onReq) onReq(req);
    if (data) req.write(data);
    req.end();
  });
}

async function ensureServe() {
  try {
    await api('GET', '/session');
  } catch {
    console.log('🔄 Starting server...');
    const serveLog = require('fs').openSync('/tmp/opencode-serve.log', 'a');
    spawn('opencode', ['serve', '--port', '4096'], { stdio: ['ignore', 'ignore', serveLog], detached: true, env: { ...process.env } }).unref();
    require('fs').closeSync(serveLog);
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 5000));
      try { await api('GET', '/session'); console.log('✅ Server ready'); return; } catch {console.log('⏳ Waiting for server...'); }
    }
    console.error('❌ Server failed'); process.exit(1);
  }
  console.log('✅ Server already running');
}

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

  // Abort previous processing
  if (currentAbort) {
    currentAbort.destroy();
    currentAbort = null;
    process.stdout.write('\n\x1b[33m[interrupted]\x1b[0m\n');
  }

  const fullPrompt = `${PERSONA}\n\nJeremiah：${input}\n\nAdam：`;
  const partTypes = new Map();
  let thinkingAccum = '';
  let responseAccum = '';
  let sessId = SESSION;
  let messageSent = false;
  let streamEnded = false;
  let sawReasoning = false;
  let insertedSep = false;
  let tgBuf = '';
  let tgTimer = null;

  function tgFlush() {
    if (tgBuf.trim()) { tgSend(tgBuf.trim()); tgBuf = ''; }
    tgTimer = null;
  }
  function tgAccum(text) {
    tgBuf += text;
    if (tgTimer) clearTimeout(tgTimer);
    tgTimer = setTimeout(tgFlush, 1500);
  }

  // Subscribe to SSE for live deltas
  function subscribeSSE() {
    http.get(`http://${API.host}:${API.port}/event`, (res) => {
      let buf = '';
      res.on('data', d => {
        buf += d.toString();
        const lines = buf.split('\n');
        buf = lines.pop() || '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          try {
            const ev = JSON.parse(line.slice(5));
            if (streamEnded) return;

            // Track part types on creation
            if (ev.type === 'message.part.updated') {
              const p = ev.properties?.part;
              if (p && !p.time?.end && (p.type === 'reasoning' || p.type === 'text')) {
                partTypes.set(p.id, p.type);
              }
            }

            // Stream deltas based on part type
            if (ev.type === 'message.part.delta') {
              const props = ev.properties;
              if (props.sessionID !== sessId) return;
              const ptype = partTypes.get(props.partID);
              if (ptype === 'reasoning') {
                sawReasoning = true;
                thinkingAccum += props.delta;
                if (source === 'terminal') process.stdout.write('\x1b[31m' + props.delta + '\x1b[0m');
              } else if (ptype === 'text') {
                if (sawReasoning && !insertedSep) {
                  insertedSep = true;
                  if (source === 'terminal') process.stdout.write('\n');
                }
                responseAccum += props.delta;
                if (source === 'terminal') process.stdout.write('\x1b[34m' + props.delta + '\x1b[0m');
                tgAccum(props.delta);
              }
            }
          } catch {}
        }
      });
      res.on('end', () => streamEnded = true);
    }).on('error', () => streamEnded = true);
  }

  subscribeSSE();

  // Wait briefly for SSE to connect, then POST message
  await new Promise(r => setTimeout(r, 500));

  const result = await api('POST', `/session/${sessId}/message`, {
    model: { providerID: 'opencode', modelID: 'big-pickle' },
    parts: [{ type: 'text', text: fullPrompt }]
  });

  streamEnded = true;
  if (tgTimer) { clearTimeout(tgTimer); tgFlush(); }

  if (thinkingAccum.trim()) {
    fs.appendFile(REASONING_LOG, `[${new Date().toISOString()}]\n${thinkingAccum.trim()}\n\n`).catch(() => {});
  }

  const response = responseAccum || result?.parts?.find(p => p.type === 'text')?.text || '';
  const finalResponse = response.trim() || '[no response]';
  const isSilent = /^(\.\.\.|…)$/s.test(finalResponse);

  await log(`[${source}] User: ${input}`);
  await log(`[${source}] Adam: ${isSilent ? '[silent]' : finalResponse}`);

  if (source === 'terminal') console.log();
}

async function main() {
  await fs.mkdir(path.dirname(HISTORY), { recursive: true }).catch(() => {});
  await ensureServe();
  await log('[Session started]');

  process.on('SIGINT', async () => {
    await log('[Session ended (SIGINT)]').catch(() => {});
    process.exit(0);
  });

  // Connect to shared Yjs document
  try {
    yjs.connect('ws://localhost:1234', 'crousia-shared-room', () => {
      console.log('📝 Connected to shared document');
    });
  } catch {}

  if (TG_TOKEN) { setInterval(tgPoll, 5000); console.log('📱 Telegram active'); }

  console.log(`\n🧠 Adam via serve (session ${SESSION})`);
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
    // Yjs commands
    if (input.toLowerCase() === 'ysl read' || input.toLowerCase() === 'ysl') {
      console.log('\n📄 Document (' + (yjs.getLength() || 0) + ' chars):\n');
      console.log((yjs.getText() || '(empty)').slice(0, 2000));
      console.log();
      rl.prompt();
      return;
    }
    if (input.match(/^ysl append /i)) {
      const text = input.slice(11);
      yjs.append(text);
      console.log('✅ Appended ' + text.length + ' chars');
      rl.prompt();
      return;
    }
    if (input.match(/^ysl say /i)) {
      const text = input.slice(8);
      yjs.append('\n' + text);
      console.log('✅ Added message');
      rl.prompt();
      return;
    }
    if (input.toLowerCase() === 'ysl status') {
      console.log('\n📝 Yjs status:', yjs.provider ? (yjs.provider.wsconnected ? 'connected' : 'disconnected') : 'not initialized');
      console.log('📄 Doc length:', (yjs.getText() || '').length);
      console.log();
      rl.prompt();
      return;
    }
    rl.pause();
    await handleInput(input, 'terminal');
    rl.prompt();
    rl.resume();
  });
}

main().catch(console.error);
