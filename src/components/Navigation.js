import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navigation.css'; // Import the CSS file

const Navigation = ({ isAuthenticated, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login'); // Redirect to login after logout
  };

  return (
    <nav>
      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/notes">Notes</Link>
      </div>

      <div className="nav-buttons">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
