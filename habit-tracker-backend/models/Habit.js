// models/Habit.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const HabitSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  completedDays: {
    type: [Boolean],
    default: Array(31).fill(false), // Array to track completion for 31 days
  },
});

module.exports = mongoose.model('Habit', HabitSchema);
