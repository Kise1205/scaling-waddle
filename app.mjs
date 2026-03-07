//app.mjs
//we are in ES6, use this. 
import 'dotenv/config'; 
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';  // For async file reading
import { MongoClient, ServerApiVersion, ObjectId } from 'mongodb';

//const { MongoClient, ServerApiVersion } = require('mongodb');

// app.mjs


const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const uri = process.env.MONGO_URI;  
const myVar = 'injected from server'; // Declare your variable


app.use(express.static(join(__dirname, 'public')));
app.use(express.json()); 




// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongo() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
}
connectToMongo();


// GET - Fetch all quebec records
app.get('/api/quebec', async (req, res) => {
  try {
    // SỬA: Trỏ đúng vào database 'quebec' và collection 'quebec'
    const db = client.db('quebec');
    const collection = db.collection('quebec');
    
    const records = await collection.find({}).toArray();
    res.json(records);
  } catch (error) {
    console.error('Error fetching quebec:', error);
    res.status(500).json({ error: 'Failed to fetch quebec' });
  }
});

// UPDATE - Update quebec record
app.put('/api/quebec/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // SỬA: Lấy trường 'name' từ body để khớp với database của bạn
    const { name } = req.body;
    
    const db = client.db('quebec');
    const collection = db.collection('quebec');
    
    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      // SỬA: Update trường 'name'
      { $set: { name, updatedAt: new Date() } }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'quebec updated!' });
  } catch (error) {
    console.error('Error updating quebec:', error);
    res.status(500).json({ error: 'Failed to update quebec' });
  }
});

// DELETE - Delete quebec record
app.delete('/api/quebec/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const db = client.db('quebec');
    const collection = db.collection('quebec');
    
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'quebec deleted!' });
  } catch (error) {
    console.error('Error deleting quebec:', error);
    res.status(500).json({ error: 'Failed to delete quebec' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});