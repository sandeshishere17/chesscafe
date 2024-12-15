import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from './cartcontext'; // Import the cart context
import './SearchResult.css'; // Import the CSS file

const SearchResult = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { addToCart } = useCart(); // Use the cart context
    const [searchResults, setSearchResults] = useState([]);
    const query = new URLSearchParams(location.search).get('query');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await axios.get(`http://localhost:4000/api/search?query=${query}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error('Error fetching search results:', error);
            }
        };

        if (query) {
            fetchSearchResults();
        }
    }, [query]);

    const handleProductClick = (product) => {
        navigate(`/product/${product._id}`);
    };

    const handleAddToCart = async (product) => {
        const token = localStorage.getItem('token'); // Check for token

        if (!token) {
            // No token found, user not logged in
            alert('Please log in to add items to your cart.');
            navigate('/login'); // Redirect to login page
        } else {
            // User is logged in, proceed to add item to cart
            const quantity = parseInt(prompt('Enter quantity:', '1'), 10);
            if (quantity > 0) {
                try {
                    const response = await axios.post(`http://localhost:4000/api/addtocart`, {
                        ...product,
                        quantity,
                    }, {
                        headers: {
                            'Authorization': `Bearer ${token}` // Include the token in the request
                        }
                    });
                    addToCart(response.data); // Assuming backend returns the updated cart item
                } catch (error) {
                    console.error('Failed to add item to cart:', error);
                }
            }
        }
    };

    return (
        <div className="search-results-container">
            {searchResults.length > 0 ? (
                searchResults.map((product) => (
                    <div key={product._id} className="search-result-item">
                        <img
                            src={`/imageoffood/${encodeURIComponent(product.pic)}`}
                            alt={product.name}
                            className="search-result-image"
                            onClick={() => handleProductClick(product)}
                        />
                        <div className="search-result-details">
                            <h2>{product.name}</h2>
                            <p>{product.description}</p>
                            <p>Price:₹{product.price}</p>
                            <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
                        </div>
                    </div>
                ))
            ) : (
                <p>No results found for "{query}"</p>
            )}
        </div>
    );
};

export default SearchResult;
