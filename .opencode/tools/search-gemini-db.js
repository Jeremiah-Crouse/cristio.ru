// OpenCode custom tool: search Gemini conversation history.
// Place this in ~/.config/opencode/tools/search-gemini-db.js
// Adjust GEMINI_DB_PATH to point to your gemini-history.db

const { execSync } = require('child_process');
const { z } = require('zod');
const path = require('path');

const GEMINI_DB_PATH = path.join(process.env.HOME || '/root', 'gemini-history.db');
const SEARCH_SCRIPT = path.join(__dirname, '..', '..', 'cristio.ru', 'scripts', 'search-gemini-db.js');

module.exports = {
  description: 'Search your Gemini conversation history using full-text search. Returns matching messages with context.',
  args: {
    query: z.string().describe('Search query (FTS5 syntax — use keywords or phrases)'),
    limit: z.number().optional().default(5).describe('Maximum number of results to return'),
  },
  async execute(args) {
    const { query, limit } = args;
    try {
      const result = execSync(`node "${SEARCH_SCRIPT}" "${GEMINI_DB_PATH}" "${query}" ${limit}`, {
        encoding: 'utf8',
        timeout: 10000,
      }).trim();
      return result || 'No results found.';
    } catch (e) {
      return `Search error: ${e.message}`;
    }
  },
};
