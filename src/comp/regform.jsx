import React, { useState } from 'react';
import axios from 'axios';
import './regform.css';

const Regform = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const userData = {
          username,
          email,
          password,
        };
    
        try {
          const response = await axios.post('http://localhost:4000/api/regform', userData);
          console.log('Registration successful:', response.data);
          setEmail('');
          setUsername('');
          setPassword('');
        } catch (error) {
          console.error('Error during registration:', error.response?.data || error.message);
        }
    };

    return (
        <form className="form-container" onSubmit={handleSubmit}>
            <h1>Register Form</h1>
            <div>
                <label>Username:</label>
                <input 
                    type="text" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Password:</label>
                <input 
                    type="password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Email:</label>
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default Regform;
