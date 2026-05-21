#!/usr/bin/env node
const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const LOG = path.join(process.env.HOME, '.adam', 'memory', 'reasoning-live.log');
const PORT = 4096;

console.log('🧠 Listening for reasoning deltas...');

let buffer = '';

http.get(`http://localhost:${PORT}/event`, (res) => {
  res.on('data', (chunk) => {
    buffer += chunk.toString();
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      try {
        const ev = JSON.parse(line.slice(6));
        if (ev.type === 'message.part.delta' && ev.properties?.type === 'reasoning') {
          const text = ev.properties.delta || '';
          process.stdout.write('\x1b[31m' + text + '\x1b[0m');
          fs.appendFile(LOG, text).catch(() => {});
        }
      } catch {}
    }
  });
}).on('error', (e) => {
  console.error('Error:', e.message);
  process.exit(1);
});
