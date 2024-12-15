import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState([]); // Add this state
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is already logged in by checking the token in localStorage
    const token = localStorage.getItem('token');
    const savedUsername = localStorage.getItem('username');

    if (token && savedUsername) {
      setIsLoggedIn(true);
      setUsername(savedUsername);  // Set the username from localStorage

      // Fetch cart items if user is already logged in
      fetchCartItems(token);
    }
  }, []);

  const fetchCartItems = async (token) => {
    try {
      const cartResponse = await axios.get('http://localhost:4000/api/getcartitems', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCartItems(cartResponse.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/login', { username, password });

      // Save token and username to localStorage
      const token = response.data.token;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username); // Save the username
      setIsLoggedIn(true); // Update the login state

      console.log('Token:', token);
      console.log('Username:', username);

      // Fetch cart items after successful login
      fetchCartItems(token);

      // Redirect the user after successful login
      navigate('/'); // Redirect to home page or any other page
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    localStorage.removeItem('username'); // Remove the username
    localStorage.removeItem('puzzleSolved');//remove the puzzle flag
    setIsLoggedIn(false); // Update the login state
    
    navigate('/login'); // Redirect to login page or home page
  };

  return (
    <div className="login-container">
      {isLoggedIn ? (
        <div className="logged-in-actions">
          <p>Welcome, {username}!</p> {/* Display the logged-in username */}
         
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      ) : (
        <form className="login-form" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Login</button>
          <div className="register-link">
            Not registered? <Link to="/regform">Click here to register</Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default Login;
