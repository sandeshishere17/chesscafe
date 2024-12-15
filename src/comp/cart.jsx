import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './cart.css'; // Import the CSS file
import { fetchCartItems } from './cartu'; // Ensure this import is correct

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const navigate = useNavigate(); // Use useNavigate for redirection

    useEffect(() => {
        const token = localStorage.getItem('token'); // Use 'token' to match the key set in LoginForm
        
        if (!token) {
            // No token found, redirect to login page
            alert('Please log in to access this page.');
            navigate('/login');
        } else {
            // Token found, proceed to fetch cart items
            fetchCartItemsFromBackend();
        }
    }, [navigate]);

    const fetchCartItemsFromBackend = async () => {
        try {
            const items = await fetchCartItems();
            setCartItems(items);
        } catch (error) {
            console.error('Error fetching cart items:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            await axios.delete(`http://localhost:4000/api/removefromcart/${itemId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems(cartItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error(`Error deleting item with ID ${itemId}:`, error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');
        try {
            await axios.put(`http://localhost:4000/api/updatequantity/${itemId}`, { quantity }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems(cartItems.map(item => item._id === itemId ? { ...item, quantity } : item));
        } catch (error) {
            console.error(`Error updating quantity for item with ID ${itemId}:`, error);
        }
    };

    const clearCart = async () => {
        const token = localStorage.getItem('token');
        if (!token) return navigate('/login');

        try {
            await axios.delete(`http://localhost:4000/api/clearcart`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCartItems([]);
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    };

    const totalBill = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const handleCheckout = () => {
        navigate('/checkout'); // Redirect to the checkout page
    };

    return (
        <div className="cart-container">
            <h2>Shopping Cart</h2>
            {cartItems.length > 0 ? (
                <>
                    <ul>
                        {cartItems.map(item => (
                            <li key={item._id} className="cart-item">
                                <img src={`/imageoffood/${encodeURIComponent(item.pic)}`} alt={item.name} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h3>{item.name}</h3>
                                    <p>Price: ₹{item.price}</p>
                                    <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateQuantity(item._id, parseInt(e.target.value, 10))}
                                        min="1"
                                    />
                                    <button onClick={() => removeFromCart(item._id)}>Remove</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="cart-total">
                        <h3>Total Bill: ₹{totalBill.toFixed(2)}</h3>
                        <button onClick={clearCart}>Clear Cart</button>
                        <button onClick={handleCheckout} className="checkout-button">Proceed to Checkout</button>
                    </div>
                </>
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default Cart;
