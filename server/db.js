const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // SSL is mandatory for Supabase/Render production
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 10000, // 10 seconds timeout
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