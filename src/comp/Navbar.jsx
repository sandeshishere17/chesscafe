import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { useCart } from './cartcontext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const { items = [] } = useCart();  // Default to an empty array if items is undefined

    useEffect(() => {
        // Check if there's a token in local storage to determine if the user is logged in
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${searchQuery}`);
        }
    };

    // Safeguard against non-array items
    const totalItems = Array.isArray(items) ? items.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <nav className="navbar">
            <Link to="/" className="navbar-logo">
                <img src="/imageoffood/logochesscafe1.png" alt="Chess Cafe Logo" className="navbar-logo-img" />
            </Link>
            <ul className="navbar-nav">
                <li className="nav-item"><Link to="/" className="nav-link">Home</Link></li>
                {!isLoggedIn && (
                    <li className="nav-item"><Link to="/login" className="nav-link">Login</Link></li>
                )}
                <li className="nav-item"><Link to="/about" className="nav-link">About</Link></li>
                <li className="nav-item"><Link to="/chess-puzzle" className="nav-link">Chess Puzzle</Link></li>
                <li className="nav-item"><Link to="/vieworder" className="nav-link">ViewOrders</Link></li>
                <li className="nav-item">
                    <Link to="/cart" className="cart-icon-container">
                        <FontAwesomeIcon icon={faShoppingCart} className="cart-icon" />
                        {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
                    </Link>
                </li>
            </ul>
            <form className="navbar-search" onSubmit={handleSearch}>
                <input 
                    type="text" 
                    className="search-input" 
                    placeholder="Search..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                />
                <button type="submit" className="search-button">Search</button>
            </form>
        </nav>
    );
};

export default Navbar;
