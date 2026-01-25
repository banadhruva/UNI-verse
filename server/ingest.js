require('dotenv').config();
const { HfInference } = require('@huggingface/inference');
const pool = require('./db'); // Import your existing DB connection

const hf = new HfInference(process.env.HF_TOKEN);

async function ingestEventRules(eventId, rawRules) {
  console.log(`🚀 Processing rules for Event ID: ${eventId}`);

  try {
    // 1. Get AI Summary from Hugging Face
    const result = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { 
          role: "user", 
          content: `Convert these messy university rules into a clean HTML bulleted list for a website: ${rawRules}` 
        }
      ],
      max_tokens: 500,
    });

    const aiSummary = result.choices[0].message.content;

    // 2. Save to PostgreSQL
    const query = `
      INSERT INTO event_rules (event_id, raw_content, ai_summary)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    
    const values = [eventId, rawRules, aiSummary];
    const res = await pool.query(query, values);

    console.log("✅ Database Updated! Rule ID:", res.rows[0].id);
    return res.rows[0];

  } catch (err) {
    console.error("❌ Ingestion Failed:", err.message);
  }
}

// Example usage: 
// ingestEventRules('your-uuid-here', '1. id card must. 2. no late entry.');