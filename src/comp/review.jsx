import React from 'react';
import './review.css';

function Testimonials() {
    const testimonials = [
        { name: 'sandy', message: 'Great place to relax and play chess!' },
        { name: 'bruh', message: 'Love the coffee and the friendly atmosphere.' },
        // Add more testimonials as needed
    ];

    return (
        <div className="testimonials">
            <h2>Customer Reviews</h2>
            <div className="testimonial-list">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="testimonial-item">
                        <p>"{testimonial.message}"</p>
                        <p>- {testimonial.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Testimonials;
