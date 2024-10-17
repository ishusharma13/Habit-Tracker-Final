const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Access the JWT secret from .env

// Middleware to protect routes with JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Extract token from header
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token
    req.user = decoded; // Attach decoded data to request
    next(); // Continue to next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Register Route
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  console.log('Incoming registration request:', req.body);  // Log request body

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);  // Log duplicate email
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error during registration:', error);  // Log server errors
    res.status(500).json({ message: 'Server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login request received:', req.body);  // Log request for debugging

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');  // Log if user doesn't exist
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Incorrect password');  // Log if password doesn't match
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });  // Send the JWT token
  } catch (error) {
    console.error('Error during login:', error);  // Log any server error
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route Example: Update User Profile
router.put('/update', authMiddleware, async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findByIdAndUpdate(req.user.id, { username }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Protected Route Example: Delete User Account
router.delete('/delete/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});
// Add habit Route
const Habit = require('../models/Habit'); // Import Habit model

// POST route to add a new habit
router.post('/habits', authMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const newHabit = new Habit({
      user: req.user.id, // Use req.user.id (from auth middleware)
      name,
      completedDays: Array(31).fill(false), // Initialize days to false
    });

    const savedHabit = await newHabit.save();
    res.status(201).json(savedHabit); // Respond with the newly created habit
  } catch (err) {
    console.error('Error creating habit:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET route to fetch all habits for the logged-in user
router.get('/habits', authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({ user: req.user.id }); // Query by user field
    res.json(habits);
  } catch (error) {
    console.error('Error fetching habits:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;



