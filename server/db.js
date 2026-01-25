const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ DB Connection Error:', err.message);
  }
  console.log('✅ Successfully connected to Supabase PostgreSQL');
  release();
});

module.exports = pool;