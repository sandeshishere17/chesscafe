import axios from 'axios';

export const fetchCartItems = async () => {
    const token = localStorage.getItem('token'); // Get the token from local storage

    try {
        const response = await axios.get('http://localhost:4000/api/getcartitems', {
            headers: {
                'Authorization': `Bearer ${token}` // Include the token in the request headers
            }
        });
        return response.data; // Assuming your API returns an array of cart items
    } catch (error) {
        console.error('Error fetching cart items:', error);
        throw error;
    }
};

export const deleteCartItem = async (itemId) => {
    try {
        const response = await axios.delete(`http://localhost:4000/api/cart/${itemId}`);
        return response.data; // Assuming your API returns a success message or updated cart items
    } catch (error) {
        console.error(`Error deleting item with ID ${itemId}:`, error);
        throw error;
    }
};
