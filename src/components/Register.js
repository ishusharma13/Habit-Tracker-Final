// src/components/Register.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Login.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false); // State to manage loading status
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_URL; // Use environment variable for backend URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        username,
        email,
        password,
      });

      console.log('Register response:', response.data); // Log response for debugging

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login'); // Redirect after successful registration
      }, 2000);
    } catch (err) {
      console.error('Registration error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="login-container">
      <h2>Register for Habit Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>

      <p>
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
