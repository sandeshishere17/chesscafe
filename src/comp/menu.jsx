import React from 'react';
import './menu.css';
import { Link } from 'react-router-dom';

function Menu() {
    const items = [
        { name: 'Coffee', description: 'Freshly brewed coffee',  path: '/coffee' },
        { name: 'Cakes', description: 'Variety of cake',  path: '/cake' },
        { name: 'Sandwich', description: 'Delicious sandwiches',  path: '/sandwich' },
       
    ];

    return (
        <div className="menu">
            <h2>Our Menu</h2>
            <div className="menu-items">
                {items.map((item, index) => (
                    <Link to={item.path} key={index} className="menu-item-link">
                        <div className="menu-item">
                            <h3>{item.name}</h3>
                            <p>{item.description}</p>
                           
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Menu;
