const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Create the model and export it
const User = mongoose.model('users', userSchema); // "User" -> collection will be 'users'
module.exports = User;
