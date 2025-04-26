const express = require('express');
const cors = require('cors');
const db = require('./models');
const path = require('path'); 
const { protect } = require('./middleware/auth'); 

// Import routes
const clientRoutes = require('./routes/clientRoutes');
const programRoutes = require('./routes/programRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 


app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Serve the frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', protect, clientRoutes);
app.use('/api/programs', protect, programRoutes);
app.use('/api/enrollments', protect, enrollmentRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

module.exports = app;