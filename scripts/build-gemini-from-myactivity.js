// Build a searchable SQLite database from a Google My Activity export (webarchive or HTML file).
// Usage: node scripts/build-gemini-from-myactivity.js <path/to/webarchive-or-html> [output.db]

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

// --- HTML parser ---
function parseActivity(html) {
  const entries = [];
  // Match each activity card with date, text, and time
  const cardRegex = /<c-wiz[^>]*data-date="(\d{8})"[^>]*>.*?QTGV3c[^>]*>Prompted\s*(.*?)<\/div>.*?XTnvW[^>]*>(\d{1,2}:\d{2})\s*[•·]/gs;
  let match;
  while ((match = cardRegex.exec(html)) !== null) {
    const dateStr = match[1];
    let text = match[2].trim();
    const time = match[3];
    text = text.replace(/<[^>]+>/g, '');
    text = text.replace(/&#39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#34;/g, '"');
    if (text) {
      entries.push({
        date: dateStr,
        time: time,
        text: text,
        timestamp: `${dateStr.slice(0,4)}-${dateStr.slice(4,6)}-${dateStr.slice(6,8)}T${time}:00`,
        role: 'user',
      });
    }
  }
  return entries;
}

// --- .webarchive extractor ---
function extractHTML(inputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  if (ext === '.webarchive') {
    const plist = require('plist');
    const data = plist.parse(fs.readFileSync(inputPath, 'utf8'));
    const main = data.WebMainResource || {};
    return Buffer.from(main.WebResourceData || '', 'base64').toString('utf8');
  }
  return fs.readFileSync(inputPath, 'utf8');
}

// --- Main ---
const inputPath = process.argv[2];
const outputPath = process.argv[3] || path.join(__dirname, '..', 'gemini-history.db');

if (!inputPath) {
  console.error('Usage: node scripts/build-gemini-from-myactivity.js <path/to/webarchive-or-html> [output.db]');
  process.exit(1);
}

console.log(`Reading ${inputPath}...`);
const html = extractHTML(inputPath);
const entries = parseActivity(html);

// Deduplicate
const seen = new Set();
const unique = [];
for (const e of entries) {
  if (!seen.has(e.text)) {
    seen.add(e.text);
    unique.push(e);
  }
}

console.log(`Found ${unique.length} unique prompts (from ${entries.length} total).`);

// Build SQLite database
const db = new Database(outputPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    created TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conv_id INTEGER,
    role TEXT,
    content TEXT,
    timestamp TEXT,
    FOREIGN KEY (conv_id) REFERENCES conversations(id)
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(content, role);
`);

const insertConv = db.prepare('INSERT OR IGNORE INTO conversations (title, created) VALUES (?, ?)');
const insertMsg = db.prepare('INSERT INTO messages (conv_id, role, content, timestamp) VALUES (?, ?, ?, ?)');

// Group entries by day as conversations
const byDate = {};
for (const e of unique) {
  const day = e.timestamp.slice(0, 10);
  if (!byDate[day]) byDate[day] = [];
  byDate[day].push(e);
}

const tx = db.transaction(() => {
  let msgCount = 0;
  for (const [day, msgs] of Object.entries(byDate)) {
    msgs.sort((a, b) => a.timestamp.localeCompare(b.timestamp));
    const title = `Gemini — ${day}`;
    insertConv.run(title, day);
    const convId = db.prepare('SELECT id FROM conversations WHERE title = ?').get(title).id;
    for (const m of msgs) {
      insertMsg.run(convId, m.role, m.text, m.timestamp);
      msgCount++;
    }
  }
  db.exec('INSERT INTO messages_fts(rowid, content, role) SELECT id, content, role FROM messages;');
  console.log(`Inserted ${Object.keys(byDate).length} conversation days, ${msgCount} messages.`);
});

tx();
db.close();
console.log(`Database written to ${outputPath}`);
