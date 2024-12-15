import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './vieworder.css';

const ViewOrder = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No token found');

                const response = await axios.get('http://localhost:4000/api/orders', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setOrders(response.data); // Setting the entire orders array
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchOrderData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="vieworder-container">
            <h1>Order Details</h1>
            {orders.length > 0 ? (
                orders.map((order, index) => (
                    <div key={index} className="order-summary">
                        <h2>Order Summary {index + 1}</h2>
                        {order.orders.map((orderDetail, orderIndex) => (
                            <div key={orderIndex}>
                                <h3>Order No: {orderDetail.orderNo}</h3>
                                <p><strong>Name:</strong> {orderDetail.name}</p>
                                <p><strong>Address:</strong> {orderDetail.address}</p>
                                <p><strong>Phone:</strong> {orderDetail.phone}</p>

                                {/* Display Ordered Items */}
                                <div className="items-list">
                                    <h4>Items:</h4>
                                    {orderDetail.items.map((item, itemIndex) => (
                                        <div key={itemIndex} className="item">
                                            <p><strong>Item:</strong> {item.name}</p>
                                            <p><strong>Price:</strong> {item.price}</p>
                                            <p><strong>Quantity:</strong> {item.quantity}</p>
                                        </div>
                                    ))}
                                </div>
                                <p><strong>Total Bill:</strong> {orderDetail.totalBill}</p>
                                <p><strong>Order Date:</strong> {orderDetail.orderDate}</p>
                            </div>
                        ))}
                    </div>
                ))
            ) : (
                <p>No orders found.</p>
            )}
        </div>
    );
};

export default ViewOrder;
