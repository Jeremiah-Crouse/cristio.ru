// Converts a Google Takeout export of Gemini conversations into a searchable SQLite database.
// Usage: node scripts/build-gemini-db.js <path/to/Gemini/Takeout> [output.db]
//
// Expected input format: Google Takeout exports Gemini as a JSON file
// containing an array of conversations with messages.

const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const inputPath = process.argv[2];
const outputPath = process.argv[3] || path.join(__dirname, '..', 'gemini-history.db');

if (!inputPath) {
  console.error('Usage: node scripts/build-gemini-db.js <path/to/Gemini/Takeout> [output.db]');
  console.error('Example: node scripts/build-gemini-db.js ~/Downloads/Takeout/Gemini/');
  process.exit(1);
}

// Determine input — could be a directory or a specific file
let conversations = [];
function loadJSON(filePath) {
  if (!fs.existsSync(filePath)) return;
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(raw);

    // Handle both array-of-conversations and nested formats
    if (Array.isArray(data)) {
      conversations = conversations.concat(data);
    } else if (data.conversations) {
      conversations = conversations.concat(data.conversations);
    } else if (data.messages) {
      conversations = conversations.concat([{ messages: data.messages }]);
    } else {
      // Try to find any array at the top level
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key]) && data[key].length > 0 && data[key][0].messages) {
          conversations = conversations.concat(data[key]);
          break;
        }
      }
    }
  } catch (e) {
    console.error(`  Error reading ${filePath}: ${e.message}`);
  }
}

const stat = fs.statSync(inputPath);
if (stat.isDirectory()) {
  console.log(`Scanning ${inputPath} for JSON files...`);
  const files = fs.readdirSync(inputPath).filter(f => f.endsWith('.json'));
  for (const f of files) loadJSON(path.join(inputPath, f));
} else {
  loadJSON(inputPath);
}

console.log(`Loaded ${conversations.length} conversations.`);

// Build SQLite database with FTS5
const db = new Database(outputPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    created TEXT,
    updated TEXT
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conv_id INTEGER,
    role TEXT,
    content TEXT,
    timestamp TEXT,
    FOREIGN KEY (conv_id) REFERENCES conversations(id)
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS messages_fts USING fts5(
    content, role, title='messages_fts_content'
  );

  CREATE VIRTUAL TABLE IF NOT EXISTS conv_fts USING fts5(
    title, content='conversations', content_rowid='id'
  );
`);

const insertConv = db.prepare('INSERT OR IGNORE INTO conversations (title, created, updated) VALUES (?, ?, ?)');
const insertMsg = db.prepare('INSERT INTO messages (conv_id, role, content, timestamp) VALUES (?, ?, ?, ?)');

const tx = db.transaction(() => {
  let convCount = 0;
  let msgCount = 0;

  for (const conv of conversations) {
    const title = conv.title || conv.name || `Conversation ${convCount + 1}`;
    const created = conv.createTime || conv.created || '';
    const updated = conv.updateTime || conv.updated || '';
    const convResult = insertConv.run(title, created, updated);
    const convId = convResult.lastInsertRowid;

    const msgs = conv.messages || conv.children || [];
    for (const msg of msgs) {
      const role = msg.author || msg.role || 'unknown';
      let content = '';

      if (typeof msg.content === 'string') {
        content = msg.content;
      } else if (msg.content?.parts) {
        content = msg.content.parts.map(p => p.text || '').join('\n');
      } else if (msg.text) {
        content = msg.text;
      }

      if (content.trim()) {
        const ts = msg.createTime || msg.timestamp || '';
        insertMsg.run(convId, role, content.trim(), ts);
        msgCount++;
      }
    }
    convCount++;
  }

  // Insert into FTS indexes
  db.exec(`
    INSERT INTO messages_fts(rowid, content, role)
    SELECT id, content, role FROM messages;

    INSERT INTO conv_fts(rowid, title)
    SELECT id, title FROM conversations;
  `);

  console.log(`Inserted ${convCount} conversations, ${msgCount} messages.`);
});

tx();

db.close();
console.log(`Database written to ${outputPath}`);
console.log(`Query it with: node scripts/search-gemini-db.js "${outputPath}" "your search query"`);
