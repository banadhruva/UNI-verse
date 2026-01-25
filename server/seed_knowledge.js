const { Pool } = require('pg');
const { OpenAI } = require('openai');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function seedInfo(eventId, text) {
  // 1. Generate Vector
  const response = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text,
  });
  const vector = response.data[0].embedding;

  // 2. Save to Postgres
  await pool.query(
    'INSERT INTO event_knowledge (event_id, content, embedding) VALUES ($1, $2, $3)',
    [eventId, text, JSON.stringify(vector)]
  );
  console.log("Knowledge chunk added!");
}

// Example: seedInfo('some-uuid', 'The Tech Fest 2026 starts at 9 AM. Entry is free for CS students.');