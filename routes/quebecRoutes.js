import express from 'express';
import * as quebecController from '../controllers/quebecController.js';

const router = express.Router();

export default (client) => {
  // READ — Get all game records
  router.get('/', (req, res) => quebecController.getAllRecords(req, res, client));

  // CREATE — Add a new game record
  router.post('/', (req, res) => quebecController.createRecord(req, res, client));

  // UPDATE — Change a game's name
  router.put('/:id', (req, res) => quebecController.updateRecord(req, res, client));

  // DELETE — Remove a game record
  router.delete('/:id', (req, res) => quebecController.deleteRecord(req, res, client));

  return router;
};