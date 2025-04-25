const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

// Enroll a client in a program
router.post('/', enrollmentController.createEnrollment);

// Get all enrollments
router.get('/', enrollmentController.getAllEnrollments);

// Get enrollment by ID
router.get('/:id', enrollmentController.getEnrollmentById);

// Update enrollment
router.put('/:id', enrollmentController.updateEnrollment);

// Remove enrollment
router.delete('/:id', enrollmentController.deleteEnrollment);

module.exports = router;