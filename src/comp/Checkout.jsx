import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from './cartcontext'; // Assuming you have a cart context
import axios from 'axios';
import jsPDF from 'jspdf';

import './checkout.css'; // Import your CSS file

const Checkout = () => {
    const { items } = useCart(); // Accessing cart items from the context
    const [totalBill, setTotalBill] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [gst, setGst] = useState(0);
    const [orderDetails, setOrderDetails] = useState({
        name: '',
        address: '',
        phone: '',
        paymentMethods: {
            'Credit Card': false,
            'Pay on Delivery': false,
            'UPI': false,
        },
        paymentDetails: {
            creditCardNumber: '',
            creditCardExpiry: '',
            creditCardCVV: '',
            upiID: ''
        }
    });
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Calculate total without discount
        const calculatedTotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
        
        // Check if the puzzle is solved
        const isPuzzleSolved = localStorage.getItem('puzzleSolved') === 'true';
        
        // Calculate discount
        const discountAmount = isPuzzleSolved ? calculatedTotal * 0.10 : 0; // 10% discount if the puzzle is solved
        console.log("Discount Amount:", discountAmount);
    
        // Apply discount
        const discountedTotal = calculatedTotal - discountAmount;
        console.log("Total amount after discount:", discountedTotal);
        
        // Calculate GST (18%) on the discounted total
        const gst = discountedTotal * 0.18; 
        console.log("GST:", gst);
    
        // Shipping cost (₹0.00)
        const shippingCost = 0;
        
        // Final total bill
        const finalTotalBill = discountedTotal + gst + shippingCost;
        console.log("Final Bill:", finalTotalBill);
        
        // Update state
        setDiscount(discountAmount);
        setTotalBill(finalTotalBill);
        setGst(gst);
    }, [items]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setOrderDetails(prevDetails => ({
            ...prevDetails,
            paymentMethods: {
                ...prevDetails.paymentMethods,
                [name]: checked
            }
        }));
    };

    const handlePaymentDetailChange = (e) => {
        const { name, value } = e.target;
        setOrderDetails(prevDetails => ({
            ...prevDetails,
            paymentDetails: {
                ...prevDetails.paymentDetails,
                [name]: value
            }
        }));
    };

    const generateBillReceipt = () => {
        const doc = new jsPDF();
        doc.setFontSize(18);
        doc.text('Bill Receipt', 10, 10);

        doc.setFontSize(12);
        doc.text(`Name: ${orderDetails.name}`, 10, 20);
        doc.text(`Address: ${orderDetails.address}`, 10, 30);
        doc.text(`Phone: ${orderDetails.phone}`, 10, 40);

        doc.text('Order Summary:', 10, 50);
        items.forEach((item, index) => {
            doc.text(`${index + 1}. ${item.name} x ${item.quantity}: ₹${(item.price * item.quantity).toFixed(2)}`, 10, 60 + index * 10);
        });

        doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 10, 70 + items.length * 10);
        doc.text(`Shipping: ₹0.00`, 10, 80 + items.length * 10); 
        if (discount > 0) {
            doc.text(`Discount: -₹${discount.toFixed(2)}`, 10, 90 + items.length * 10);
        }
        doc.text(`Total: ₹${totalBill.toFixed(2)}`, 10, 100 + items.length * 10);

        doc.save('bill-receipt.pdf');
    };

    const handleSubmitOrder = async (e) => {
        e.preventDefault();

        // Validate phone number length
        if (orderDetails.phone.length !== 10 || !/^\d{10}$/.test(orderDetails.phone)) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }

        // Ensure at least one payment method is selected
        const selectedMethods = Object.keys(orderDetails.paymentMethods).filter(method => orderDetails.paymentMethods[method]);
        if (selectedMethods.length === 0) {
            alert('Please select at least one payment method.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            
            const response = await axios.post('http://localhost:4000/api/checkout', {
                items,
                totalBill,
                ...orderDetails,
                paymentMethods: selectedMethods
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.status === 201) {
                setPaymentSuccess(true);

                // Clear the puzzleSolved flag upon successful order placement
                localStorage.removeItem('puzzleSolved');

                // Store order details in localStorage
                const orderData = {
                    orderDetails,
                    items,
                    totalBill,
                    gst,
                    discount
                };
                localStorage.setItem('latestOrder', JSON.stringify(orderData));

                generateBillReceipt(); // Generate and download the bill receipt as a PDF
                
                setOrderDetails({
                    name: '',
                    address: '',
                    phone: '',
                    paymentMethods: {
                        'Credit Card': false,
                        'Pay on Delivery': false,
                        'UPI': false,
                    },
                    paymentDetails: {
                        creditCardNumber: '',
                        creditCardExpiry: '',
                        creditCardCVV: '',
                        upiID: ''
                    }
                });

                navigate('/thankyou');
            }
        } catch (error) {
            console.error('Error processing order:', error);
            alert('Payment failed. Please try again.');
        }
    };

    return (
        <div className="checkout-container">
            <div className="bill-summary">
                <h2>Bill Summary</h2>
                <ul>
                    {items.map(item => (
                        <li key={item._id}>
                            {item.name} x {item.quantity}: ₹{(item.price * item.quantity).toFixed(2)}
                        </li>
                    ))}
                </ul>
                <h3>GST (18%): ₹{gst.toFixed(2)}</h3>
                <h3>Shipping: ₹0.00</h3> {/* Shipping cost set to ₹0.00 */}
                {discount > 0 && <h3>Discount: -₹{discount.toFixed(2)}</h3>}
                <h2>Total: ₹{totalBill.toFixed(2)}</h2>
            </div>
            <div className="order-form">
                <h2>Order Details</h2>
                <form onSubmit={handleSubmitOrder}>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={orderDetails.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Address:</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={orderDetails.address}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={orderDetails.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Payment Method:</label>
                        <div className="payment-options">
                            <label>
                                <input
                                    type="checkbox"
                                    name="Credit Card"
                                    checked={orderDetails.paymentMethods['Credit Card']}
                                    onChange={handleCheckboxChange}
                                />
                                Credit Card
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="Pay on Delivery"
                                    checked={orderDetails.paymentMethods['Pay on Delivery']}
                                    onChange={handleCheckboxChange}
                                />
                                Pay on Delivery
                            </label>
                            <label>
                                <input
                                    type="checkbox"
                                    name="UPI"
                                    checked={orderDetails.paymentMethods['UPI']}
                                    onChange={handleCheckboxChange}
                                />
                                UPI
                            </label>
                        </div>
                    </div>

                    {/* Conditionally Render Payment Details */}
                    {orderDetails.paymentMethods['Credit Card'] && (
                        <div className="form-group">
                            <label htmlFor="creditCardNumber">Credit Card Number:</label>
                            <input
                                type="text"
                                id="creditCardNumber"
                                name="creditCardNumber"
                                value={orderDetails.paymentDetails.creditCardNumber}
                                onChange={handlePaymentDetailChange}
                                required
                            />
                        </div>
                    )}

                    {orderDetails.paymentMethods['UPI'] && (
                        <div className="form-group">
                            <label htmlFor="upiID">UPI ID:</label>
                            <input
                                type="text"
                                id="upiID"
                                name="upiID"
                                value={orderDetails.paymentDetails.upiID}
                                onChange={handlePaymentDetailChange}
                                required
                            />
                        </div>
                    )}

                    <button type="submit" className="submit-order-btn">Place Order</button>
                </form>
            </div>
        </div>
    );
};

export default Checkout;
