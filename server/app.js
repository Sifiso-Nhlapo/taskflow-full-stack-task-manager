
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const app = express();

// Allow requests from our React frontend.
app.use(cors());

// Allow Express to read JSON request bodies.
app.use(express.json());

// Basic API health-check route.
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TaskFlow API is running!',
  });
});
//Public registration and login routes.
app.use('/api/auth', authRoutes);

//Protected task routes
app.use('/api/tasks',taskRoutes);

module.exports = app;
