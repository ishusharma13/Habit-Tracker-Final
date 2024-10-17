import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState('');
  const API_BASE_URL = process.env.REACT_APP_API_URL;

  // Fetch habits when the component mounts
  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/habits`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHabits(res.data); // Populate habits from the backend
      } catch (err) {
        console.error('Error fetching habits:', err);
      }
    };
    fetchHabits();
  }, [API_BASE_URL]);

  const handleAddHabit = async () => {
    if (newHabit.trim() !== '') {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(
          `${API_BASE_URL}/habits`,
          { name: newHabit },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setHabits([...habits, res.data]); // Update the habits list
        setNewHabit(''); // Clear input field
      } catch (err) {
        console.error('Error adding habit:', err);
      }
    }
  };

  const handleCheckboxChange = async (habitId, dayIndex) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `${API_BASE_URL}/habits/${habitId}/days/${dayIndex}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // Update local state after a successful backend update
      setHabits((prev) =>
        prev.map((habit) =>
          habit._id === habitId
            ? { ...habit, completedDays: res.data.completedDays }
            : habit
        )
      );
    } catch (err) {
      console.error('Error updating habit:', err);
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Habits</h2>

      <div className="habit-form">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter a new habit..."
          className="form-input"
        />
        <button onClick={handleAddHabit} className="form-button">
          Add Habit
        </button>
      </div>

      {habits.length === 0 ? (
        <p className="empty-message">No habits found. Add a new habit to get started!</p>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Habit</th>
                {Array.from({ length: 31 }, (_, i) => (
                  <th key={i}>{i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {habits.map((habit) => (
                <tr key={habit._id}>
                  <td>{habit.name}</td>
                  {habit.completedDays.map((completed, dayIndex) => (
                    <td key={dayIndex}>
                      <input
                        type="checkbox"
                        checked={completed}
                        onChange={() => handleCheckboxChange(habit._id, dayIndex)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
