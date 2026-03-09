import { ObjectId } from 'mongodb';
import QuebecModel from '../models/quebecModel.js';

// --- API Logic Quebec ---

export const addGame = async (db, data) => {
    // data { name, repo, app, image }
    return await db.collection('games').insertOne({
        name: data.name,
        repo: data.repo,
        app: data.app,
        image: data.image,
        createdAt: new Date()
    });
};

export const getAllRecords = async (req, res, client) => {
  try {
    const db = client.db('quebec');              // Select the database
    const collection = db.collection('quebec');  // Select the collection (like a table)
    const records = await collection.find({}).toArray();  // Find ALL documents, return as array
    res.json(records);                           // Send the array back to the frontend as JSON
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

export const createRecord = async (req, res, client) => {
  try {
    const { name, repo, app, img } = req.body;    // Get the game details from the request body JSON
    const db = client.db('quebec');
    const collection = db.collection('quebec');

    const newRecord = new QuebecModel(name, repo, app, img);  // Create a new instance of the QuebecModel class

    const result = await collection.insertOne(newRecord);  // Insert the new document into the collection
    res.status(201).json({ message: 'Record created!', id: result.insertedId });  // Return 201 to indicate successful creation
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
};

export const updateRecord = async (req, res, client) => {
  try {
    const { id } = req.params;    // Get the record ID from the URL
    const { name, repo, app, img } = req.body;    // Get the new details from the request body JSON

    const db = client.db('quebec');
    const collection = db.collection('quebec');

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },                   // Filter: find the document with this _id
      { $set: { name, repo, app, img, updatedAt: new Date() } }    // Update: set the new details + timestamp
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record updated!' });
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
};

export const deleteRecord = async (req, res, client) => {
  try {
    const { id } = req.params;    // Get the record ID from the URL

    const db = client.db('quebec');
    const collection = db.collection('quebec');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }

    res.json({ message: 'Record deleted!' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
};