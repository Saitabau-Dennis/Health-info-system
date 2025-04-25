const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');

// Create a new client
router.post('/', clientController.createClient);

// Get all clients
router.get('/', clientController.getAllClients);

// Get a single client by ID
router.get('/:id', clientController.getClientById);

// Update a client
router.put('/:id', clientController.updateClient);

// Delete a client
router.delete('/:id', clientController.deleteClient);

// Get client's programs
router.get('/:id/programs', clientController.getClientPrograms);

module.exports = router;