// ============================================================
// app.mjs — Backend Server
// ============================================================
// This file sets up an Express web server that:
//   1. Serves the frontend files (HTML, CSS, JS) from the "public" folder
//   2. Connects to a MongoDB Atlas cloud database
//   3. Provides API endpoints so the frontend can Read, Update, and Delete game records
// ============================================================

import 'dotenv/config';                                   // Loads .env file into process.env
import express from 'express';                            // Web framework for building APIs
import { fileURLToPath } from 'url';                      // Helps get the current file path in ES6
import { dirname, join } from 'path';                     // Utilities for working with file paths
import { MongoClient, ServerApiVersion } from 'mongodb';  // MongoDB driver

import quebecRoutes from './routes/quebecRoutes.js';      // Import routes đã tách

// --- Step 2: Configure Express ---

const app = express();                                    // Create the Express application
const __filename = fileURLToPath(import.meta.url);        // Get this file's absolute path
const __dirname = dirname(__filename);                    // Get the folder this file lives in

app.use(express.static(join(__dirname, 'public')));       // Serve static files (HTML/CSS/JS) from "public" folder
app.use(express.json());                                  // Allow Express to parse JSON request bodies

// --- Step 3: Connect to MongoDB Atlas ---

const uri = process.env.MONGO_URI;

const client = new MongoClient(
  uri, 
  {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  }
);

// This function runs once when the server starts to verify the database connection
async function connectToMongo() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Successfully connected to MongoDB!');
    
    // --- Step 4: Define API Routes ---
    // Sử dụng Router đã tách biệt để đảm bảo cấu trúc MVC
    app.use('/api/quebec', quebecRoutes(client));

    // --- Step 5: Start the server ---
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}

connectToMongo();