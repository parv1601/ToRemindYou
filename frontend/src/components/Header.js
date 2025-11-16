// src/components/Header.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Header = () => {
  const [userName, setUserName] = useState('...');
  const API_URL = 'http://localhost:5000/api'; // Make sure this matches your backend port

  useEffect(() => {
    // Fetch the user (Brinda) name from the backend for the personalized greeting
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`);
        setUserName(res.data.name);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setUserName('You'); // Default fallback
      }
    };
    fetchUser();
  }, []);

  return (
    <header className="header">
      <h1>Yoo!</h1>
      <nav>
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/tasks" className="nav-link">Tasks</Link>
        <Link to="/wishes" className="nav-link">Wants</Link>
      </nav>
    </header>
  );
};

export default Header;