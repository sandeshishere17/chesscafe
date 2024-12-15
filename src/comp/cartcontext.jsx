import React, { createContext, useReducer, useContext, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const existingItemIndex = state.items.findIndex(item => item._id === action.payload._id);
            if (existingItemIndex >= 0) {
                const updatedItems = [...state.items];
                updatedItems[existingItemIndex].quantity += action.payload.quantity;
                return { ...state, items: updatedItems };
            } else {
                return { ...state, items: [...state.items, action.payload] };
            }
        case 'REMOVE_FROM_CART':
            return { ...state, items: state.items.filter(item => item._id !== action.payload) };
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map(item =>
                    item._id === action.payload._id
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case 'SET_CART_ITEMS':
            return { ...state, items: action.payload };
        case 'CLEAR_CART':
            return { ...state, items: [] };
        default:
            return state;
    }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    const token = localStorage.getItem('token');
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
    };

    const addToCart = (item) => {
        axios.post('http://localhost:4000/api/addtocart', item, { headers })
            .then(response => {
                dispatch({ type: 'ADD_TO_CART', payload: response.data });
            })
            .catch(error => {
                console.error('Failed to add item to cart:', error);
            });
    };

    const removeFromCart = (id) => {
        axios.delete(`http://localhost:4000/api/removefromcart/${id}`, { headers })
            .then(() => {
                dispatch({ type: 'REMOVE_FROM_CART', payload: id });
            })
            .catch(error => {
                console.error('Failed to remove item from cart:', error);
            });
    };

    const updateQuantity = (id, quantity) => {
        axios.put(`http://localhost:4000/api/updatequantity/${id}`, { quantity }, { headers })
            .then(response => {
                dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
            })
            .catch(error => {
                console.error('Failed to update item quantity:', error);
            });
    };

    const clearCart = () => {
        axios.delete('http://localhost:4000/api/clearcart', { headers })
            .then(() => {
                dispatch({ type: 'CLEAR_CART' });
            })
            .catch(error => {
                console.error('Failed to clear cart:', error);
            });
    };

    useEffect(() => {
        axios.get('http://localhost:4000/api/getcartitems', { headers })
            .then(response => {
                dispatch({ type: 'SET_CART_ITEMS', payload: response.data });
            })
            .catch(error => {
                console.error('Failed to fetch cart items:', error);
            });
    }, [headers]);

    return (
        <CartContext.Provider value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
