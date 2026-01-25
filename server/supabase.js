const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Add these to your .env file
const supabaseUrl = process.env.SUPABASE_URL; 
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const uploadToSupabase = async (file) => {
  const fileName = `resumes/${Date.now()}_${file.originalname}`;
  
  const { data, error } = await supabase.storage
    .from('resumes') // The name of the bucket you created
    .upload(fileName, file.buffer, {
      contentType: file.mimetype,
      upsert: false
    });

  if (error) throw error;

  // Get the Public URL
  const { data: publicUrlData } = supabase.storage
    .from('resumes')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
};

module.exports = { uploadToSupabase };