const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

// Create a new health program
router.post('/', programController.createProgram);

// Get all health programs
router.get('/', programController.getAllPrograms);

// Get a single program by ID
router.get('/:id', programController.getProgramById);

// Update a program
router.put('/:id', programController.updateProgram);

// Delete a program
router.delete('/:id', programController.deleteProgram);

module.exports = router;