// Search the Gemini history database from the command line.
// Usage: node scripts/search-gemini-db.js <db> <query> [limit]

const Database = require('better-sqlite3');
const path = require('path');

const dbArg = process.argv[2];
const query = process.argv[3];
const limit = parseInt(process.argv[4]) || 10;

if (!dbArg || !query) {
  console.error('Usage: node scripts/search-gemini-db.js <db> <query> [limit]');
  console.error('Default DB: ./gemini-history.db');
  process.exit(1);
}

const dbPath = path.resolve(dbArg);
if (!require('fs').existsSync(dbPath)) {
  console.error(`Database not found: ${dbPath}`);
  process.exit(1);
}

const db = new Database(dbPath);

try {
  const rows = db.prepare(`
    SELECT DISTINCT m.conv_id, c.title as conv_title, m.content, m.role, m.timestamp,
      rank
    FROM messages_fts
    JOIN messages m ON messages_fts.rowid = m.id
    LEFT JOIN conversations c ON m.conv_id = c.id
    WHERE messages_fts MATCH ?
    ORDER BY rank
    LIMIT ?
  `).all(query, limit);

  if (rows.length === 0) {
    console.log('No results.');
    db.close();
    process.exit(0);
  }

  console.log(`\n=== ${rows.length} results for "${query}" ===\n`);
  for (const r of rows) {
    console.log(`[${r.role}] in "${r.conv_title}" ${r.timestamp ? '(' + r.timestamp + ')' : ''}`);
    console.log(r.content.slice(0, 500));
    console.log();
  }
} catch (e) {
  console.error(`Search error: ${e.message}`);
  console.error('Note: FTS5 requires a valid FTS query syntax. Use simple keywords or phrases.');
}

db.close();
