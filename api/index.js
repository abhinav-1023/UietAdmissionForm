import { createServer } from 'http';
import app from '../server/server';  // Import your server.js from the server folder

export default function handler(req, res) {
  // Use the Express app for handling requests
  app(req, res);  // Forward requests to your Express app
}
