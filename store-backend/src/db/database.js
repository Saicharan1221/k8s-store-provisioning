const Database = require('better-sqlite3');

// Create or open database file
const db = new Database('stores.db');

// Create stores table if not exists
db.prepare(`
  CREATE TABLE IF NOT EXISTS stores (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    namespace TEXT,
    helm_release TEXT,
    status TEXT,
    created_at TEXT
  )
`).run();

module.exports = db;
