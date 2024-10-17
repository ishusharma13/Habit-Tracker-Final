const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config({ path: './.env' });


const app = express();

// CORS Middleware
const allowedOrigins = process.env.CORS_ORIGIN || '*';
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));

app.use(express.json()); // Parse JSON requests

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const habitRoutes = require('./routes/habitRoutes');  // Import routes

// Remove the `/api/habits` prefix
app.use('/', habitRoutes);


// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log('Port used:', PORT);


// Debug log to confirm environment variables
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('CORS Origin:', allowedOrigins);
