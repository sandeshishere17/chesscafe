import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './thankyou.css';

const ThankYou = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Extract props from location state
    const { orderDetails = {}, totalBill = 0, gst = 0, discount = 0, items = [] } = location.state || {};

    const handleViewOrder = () => {
        navigate('/vieworder');
    };

    const handlePrintReceipt = () => {
        const doc = new jsPDF();

        // Title
        doc.setFontSize(18);
        doc.text('ChessCafe Receipt', 14, 22);

        // Customer Info
        doc.setFontSize(12);
        doc.text(`Name: ${orderDetails.name || 'N/A'}`, 14, 30);
        doc.text(`Address: ${orderDetails.address || 'N/A'}`, 14, 38);
        doc.text(`Phone: ${orderDetails.phone || 'N/A'}`, 14, 46);

        // Table for items
        const itemRows = items.map(item => [
            item.name || 'N/A',
            item.quantity || 0,
            `₹${(item.price * item.quantity).toFixed(2)}`
        ]);

        doc.autoTable({
            head: [['Item', 'Quantity', 'Price']],
            body: itemRows,
            startY: 54,
        });

        // Price details
        let finalY = doc.autoTable.previous.finalY || 54;
        doc.text(`GST (18%): ₹${gst.toFixed(2)}`, 14, finalY + 10);
        doc.text(`Discount: -₹${discount.toFixed(2)}`, 14, finalY + 18);
        doc.text(`Total Bill: ₹${totalBill.toFixed(2)}`, 14, finalY + 26);

        // Save and print PDF
        doc.save('receipt.pdf');
    };

    return (
        <div className="thankyou-container-gold">
            <h1>Thank You for Your Order!</h1>
            <p>Your order has been placed successfully.</p>
            <div className="thankyou-options">
                <button onClick={handleViewOrder} className="view-order-button">View Order</button>
                {/* Add Print Receipt button if needed */}
            </div>
        </div>
    );
};

export default ThankYou;
