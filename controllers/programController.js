const { Program } = require('../models');

// Create a new health program
exports.createProgram = async (req, res) => {
  try {
    const newProgram = await Program.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Health program created successfully',
      data: newProgram
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to create health program',
      error: error.message
    });
  }
};

// Get all health programs
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.findAll();
    res.status(200).json({
      success: true,
      count: programs.length,
      data: programs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health programs',
      error: error.message
    });
  }
};

// Get a single program by ID
exports.getProgramById = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Health program not found'
      });
    }
    res.status(200).json({
      success: true,
      data: program
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve health program',
      error: error.message
    });
  }
};

// Update program
exports.updateProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Health program not found'
      });
    }

    await program.update(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Health program updated successfully',
      data: program
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to update health program',
      error: error.message
    });
  }
};

// Delete program
exports.deleteProgram = async (req, res) => {
  try {
    const program = await Program.findByPk(req.params.id);
    if (!program) {
      return res.status(404).json({
        success: false,
        message: 'Health program not found'
      });
    }
    
    // Delete will cascade to enrollments due to foreign key constraints
    await program.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Health program deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete health program',
      error: error.message
    });
  }
};