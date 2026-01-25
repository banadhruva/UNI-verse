const express = require('express');
const cors = require('cors');
const multer = require('multer');
const pool = require('./db'); 
const { uploadToSupabase } = require('./supabase'); 
const { v4: uuidv4 } = require('uuid');
const { createClient } = require('@supabase/supabase-js');
const { HfInference } = require('@huggingface/inference');
require('dotenv').config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// --- UPDATED CORS CONFIGURATION ---
// Replace the .vercel.app link with your actual URL after deployment
const corsOptions = {
  origin: [
    'http://localhost:5173', 
    'http://localhost:3000', 
    'https://uni-verse-frontend.vercel.app' 
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// Initialize AI and Supabase
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const hf = new HfInference(process.env.HF_TOKEN);

// --- HELPER: RAG INGESTION ---
async function generateAndStoreEmbedding(eventId, text) {
  try {
    let embedding = await hf.featureExtraction({
      model: "BAAI/bge-small-en-v1.5",
      inputs: text,
    });

    // Ensure embedding is a flat array for pgvector
    if (Array.isArray(embedding[0])) {
      embedding = embedding[0];
    }

    await pool.query(
      'INSERT INTO event_knowledge (event_id, content, embedding) VALUES ($1, $2, $3::vector)',
      [eventId, text, JSON.stringify(embedding)]
    );
    console.log(`✅ Knowledge embedded for event: ${eventId}`);
  } catch (err) {
    console.error("❌ Embedding failed:", err.message);
  }
}

// --- PUBLIC ROUTES (FOR STUDENTS) ---

app.get('/api/events', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM events ORDER BY event_date ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("DB Error:", err.message);
    res.status(500).json({ error: 'Server Error fetching events' });
  }
});

app.post('/api/applications', async (req, res) => {
  try {
    const { full_name, roll_number, email, event_id, competition_name, additional_info } = req.body;
    
    const existing = await pool.query(
      'SELECT id FROM event_participants WHERE roll_number = $1 AND event_id = $2',
      [roll_number, event_id]
    );
    
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "Already registered for this event." });
    }

    const newParticipant = await pool.query(
      'INSERT INTO event_participants (full_name, roll_number, email, event_id, competition_name, additional_info) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [full_name, roll_number, email, event_id, competition_name, JSON.stringify(additional_info || {})]
    );
    
    res.json({ message: "Registration successful!", data: newParticipant.rows[0] });
  } catch (err) {
    console.error("Registration Error:", err);
    res.status(500).json({ error: "Server Error during registration" });
  }
});

// --- ADMIN / COORDINATOR ROUTES ---

app.post('/api/admin/events', upload.fields([
  { name: 'banner', maxCount: 1 },
  { name: 'gallery', maxCount: 20 }
]), async (req, res) => {
  try {
    const { title, description, venue, event_date, department, competition_list, custom_fields } = req.body;
    
    // 1. Handle Banner Upload
    let bannerUrl = "https://via.placeholder.com/400x200"; 
    if (req.files['banner']) {
      bannerUrl = await uploadToSupabase(req.files['banner'][0]);
    }

    // 2. Handle Multiple Gallery Uploads
    let galleryUrls = [];
    if (req.files['gallery']) {
      galleryUrls = await Promise.all(
        req.files['gallery'].map(file => uploadToSupabase(file))
      );
    }

    // 3. Database Insertion
    const newEvent = await pool.query(
      'INSERT INTO events (title, description, venue, event_date, banner_url, department, competition_list, custom_fields, gallery_urls) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [
        title, 
        description, 
        venue, 
        event_date, 
        bannerUrl, 
        department, 
        competition_list, 
        custom_fields, 
        JSON.stringify(galleryUrls) 
      ]
    );
    
    const createdEvent = newEvent.rows[0];

    // 4. --- RAG AUTO-INGESTION ---
    const knowledgeText = `Event Name: ${title}. Department: ${department}. Venue: ${venue}. Date: ${event_date}. Description: ${description}. Rules: ${competition_list}.`;
    await generateAndStoreEmbedding(createdEvent.id, knowledgeText);
    
    res.json(createdEvent);
  } catch (err) {
    console.error("Admin Event Error:", err);
    res.status(500).json({ error: "Failed to create event and knowledge base" });
  }
});

app.get('/api/admin/applications/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const result = await pool.query(
      'SELECT * FROM event_participants WHERE event_id = $1 ORDER BY created_at DESC',
      [eventId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error fetching participant list" });
  }
});

app.delete('/api/admin/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  try {
    await pool.query('DELETE FROM event_knowledge WHERE event_id = $1', [eventId]);
    const result = await pool.query('DELETE FROM events WHERE id = $1 RETURNING *', [eventId]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Event ID not found." });
    }
    res.json({ message: "Event and associated knowledge deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err.message);
    res.status(500).json({ error: "Server error during deletion." });
  }
});

// --- RAG CHATBOT ROUTE ---

app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  try {
    let queryEmbedding = await hf.featureExtraction({
      model: "BAAI/bge-small-en-v1.5",
      inputs: question,
    });
    
    if (Array.isArray(queryEmbedding[0])) {
      queryEmbedding = queryEmbedding[0];
    }

    const result = await pool.query(
      'SELECT content FROM match_documents($1::vector, $2, $3)',
      [JSON.stringify(queryEmbedding), 0.4, 3]
    );

    const contextText = result.rows.length > 0 
      ? result.rows.map(doc => doc.content).join("\n---\n")
      : "No specific event matches found in the database.";

    const chatResponse = await hf.chatCompletion({
      model: "Qwen/Qwen2.5-72B-Instruct",
      messages: [
        { 
          role: "system", 
          content: `You are the IKGPTU Support Bot. Use the following context to answer student queries about events. If the answer is not in the context, politely say you don't have that specific detail yet. Context: ${contextText}` 
        },
        { role: "user", content: question }
      ],
      max_tokens: 500,
    });

    res.json({ answer: chatResponse.choices[0].message.content });
  } catch (err) {
    console.error("RAG Chat Error:", err);
    res.status(500).json({ answer: "I'm currently having trouble reaching the knowledge base." });
  }
});

// --- SERVER START / EXPORT ---
const PORT = process.env.PORT || 5000;

// Only listen if not running in a serverless environment (like Vercel functions)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 IKGPTU Portal Server running on port ${PORT}`);
  });
}

module.exports = app;