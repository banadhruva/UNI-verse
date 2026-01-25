import axios from 'axios';

const API = axios.create({
  // This will look for VITE_API_URL in your Vercel/Env settings
  // If it doesn't find it, it defaults to localhost
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default API;