import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from './cartcontext'; // Import the cart context
import './coffee.css'; // Make sure to update this CSS file

function Coffee() {
  const { addToCart } = useCart(); // Use the cart context

  const items = [
    { _id: "668a1e7f12c6d153f6fb0cd3", name: 'Black coffee', description: 'Its unique its smooth, its nothing like the ashy coffee of old. Before, black coffee rarely tasted like anything other than peanuts, dark chocolate', price: 300, pic: './imageoffood/blackcoffee.jpg' },
    { _id: "668a1e7f12c6d153f6fb0cd4", name: 'Filter coffee', description: 'A South Indian classic, our Filter Coffee is made with dark roasted coffee beans, brewed in a traditional metal filter, and mixed with hot milk and sugar.', price: 150, pic: './imageoffood/filtercoffee.jpg' },
    { _id: "668a1e7f12c6d153f6fb0cd5", name: 'Cappuccino', description: 'A classic Italian coffee drink, Cappuccino is made with equal parts espresso, steamed milk, and milk foam. Perfect for a balanced and flavorful coffee experience.', price: 250, pic: './imageoffood/Cappuccino.avif' },
    { _id: "668a1e7f12c6d153f6fb0cd6", name: 'Latte', description: 'A smooth and creamy favorite, our Latte is made with a shot of espresso and steamed milk, topped with a thin layer of froth. Perfectly balanced and delicious.', price: 250, pic: './imageoffood/latte.jpg' },
    { _id: "668a1e7f12c6d153f6fb0cd7", name: 'Mocha', description: 'A perfect blend of coffee and chocolate, our Mocha is made with espresso, steamed milk, and rich chocolate syrup, topped with whipped cream and a sprinkle of cocoa.', price: 250, pic: './imageoffood/mocha.jpg' },
  ];

  const [quantities, setQuantities] = useState({});

  const handleQuantityChange = (itemId, quantity) => {
    setQuantities({
      ...quantities,
      [itemId]: quantity
    });
  };

  const handleAddToCart = async (item) => {
    const quantity = parseInt(quantities[item._id], 10) || 1; // Get quantity from state

    try {
      // Fetch item details from backend
      const response = await axios.get(`http://localhost:4000/api/item/${item._id}`);
      const itemDetails = response.data;

      // Add item to cart with quantity
      addToCart({ ...itemDetails, quantity });
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  return (
    <div className="coffee-container">
      {items.map((item) => (
        <div key={item._id} className="coffee-item">
          <h1 className="name">{item.name}</h1>
          <img src={item.pic} alt={item.name} className="coffee-image" />
          <p className="desc">{item.description}</p>
          <p className="price">₹{item.price}</p>
          <input
            type="number"
            min="1"
            value={quantities[item._id] || 1}
            onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value, 10))}
            className="quantity-input"
            placeholder="Quantity"
          />
          <button onClick={() => handleAddToCart(item)} className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Coffee;
