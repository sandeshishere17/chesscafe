import React from 'react';
import { useNavigate } from 'react-router-dom';
import './events.css';

function Events() {
    const events = [
        { date: '2024-07-01', title: 'Chess Tournament', description: 'Join our chess tournament' },
        { date: '2024-07-15', title: 'Coffee Tasting', description: 'Sample our new coffee blends' },
    ];

    const navigate = useNavigate();

    const handleEventClick = (event) => {
        navigate('/register', { state: { event } });
    };

    return (
        <div className="events">
            <h2>Upcoming Events</h2>
            <div className="event-list">
                {events.map((event, index) => (
                    <div key={index} className="event-item" onClick={() => handleEventClick(event)}>
                        <h3>{event.title}</h3>
                        <p>{event.date}</p>
                        <p>{event.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Events;
