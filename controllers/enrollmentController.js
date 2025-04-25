const { Enrollment, Client, Program } = require('../models');

// Create new enrollment
exports.createEnrollment = async (req, res) => {
  try {
    // Check if client exists
    const client = await Client.findByPk(req.body.clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Client not found'
      });
    }
    
    // Check if program exists
    const program = await Program.findByPk(req.body.programId);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Program not found'
      });
    }
    
    const newEnrollment = await Enrollment.create(req.body);
    
    res.status(201).json({
      success: true,
      message: 'Client enrolled in program successfully',
      data: newEnrollment
    });
  } catch (error) {
    // Check for unique constraint violation
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Client is already enrolled in this program',
        error: error.message
      });
    }
    
    res.status(400).json({
      success: false,
      message: 'Failed to enroll client in program',
      error: error.message
    });
  }
};

// Get all enrollments
exports.getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      include: [
        { model: Client },
        { model: Program }
      ]
    });
    
    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve enrollments',
      error: error.message
    });
  }
};

// Get enrollment by ID
exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, {
      include: [
        { model: Client },
        { model: Program }
      ]
    });
    
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve enrollment',
      error: error.message
    });
  }
};

// Update enrollment
exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    await enrollment.update(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update enrollment',
      error: error.message
    });
  }
};

// Delete enrollment
exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }
    
    await enrollment.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete enrollment',
      error: error.message
    });
  }
};