import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './footer.css';
import axios from 'axios';

function Footer() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [responseMessage, setResponseMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/messages', {
                email,
                message
            });
            setResponseMessage('Message sent successfully!');
            setEmail('');
            setMessage('');
        } catch (error) {
            console.error('There was an error sending the message!', error);
            setResponseMessage('Failed to send the message.');
        }
    };

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3>About Us</h3>
                    <p>
                        Welcome to our Chess Cafe, a place where chess enthusiasts can gather, play, and learn.
                        Join us for regular tournaments, training sessions, and a great cup of coffee.
                    </p>
                </div>
                <div className="footer-section links">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li></li>
                        <li><Link to="/about">About</Link></li>
                    </ul>
                </div>
                <div className="footer-section contact-form">
                    <h3>Contact Us</h3>
                    <form onSubmit={handleSubmit}>
                        <input 
                            type="email" 
                            placeholder="Your email address..." 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <textarea 
                            placeholder="Your message..." 
                            required 
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        ></textarea>
                        <button type="submit">Send</button>
                    </form>
                    {responseMessage && <p>{responseMessage}</p>}
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} Chess Cafe. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
