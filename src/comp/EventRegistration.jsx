import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './eventregistration.css';

function EventRegistration() {
    const [reason, setReason] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send reason and phoneNumber directly in the axios request
            const response = await axios.post('http://localhost:4000/api/registerForEvent', {
                reason: reason,
                phoneNumber: phoneNumber,
            });

            // If the response is successful
            console.log('Registration successful:', response.data);
            alert('Thank you for taking part in the event!');

            // Redirect to the home page after the message
            navigate('/');
        } catch (error) {
            console.error('Error:', error.response?.data || error.message);
            alert('There was an issue with your registration. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="event-registration">
            <h2>Register for the Event</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Why do you want to join?
                    <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Phone Number:
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </form>
        </div>
    );
}

export default EventRegistration;
