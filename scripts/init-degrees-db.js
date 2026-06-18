// Initialize the degrees database
// Run: node scripts/init-degrees-db.js

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'degrees.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS degrees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    degree_type TEXT NOT NULL DEFAULT 'PhD',
    field TEXT NOT NULL DEFAULT 'Hegemony',
    issued_date TEXT NOT NULL DEFAULT (date('now')),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

db.close();
console.log(`Degrees database initialized at ${dbPath}`);
