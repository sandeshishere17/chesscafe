import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from './cartcontext'; // Import the useCart hook
import './cake.css';

function Cake() {
  const items = [
    { _id: "668a1e7f12c6d153f6fb0cd8", name: 'Butter Cake', description: 'Butter cakes are traditionally made using a creaming method.', price: 250, pic: './imageoffood/buttercake.png' },
    { _id: "668a1e7f12c6d153f6fb0cd9", name: 'Chocolate Fudge Cake', description: 'Rich and moist, our Chocolate Fudge Cake is layered with creamy chocolate ganache and topped with a smooth, decadent chocolate frosting. A chocolate lover dream come true', price: 250, pic: './imageoffood/chocolatefudgecake.png' },
    { _id: "668a1e7f12c6d153f6fb0cda", name: 'Red Velvet Cake', description: 'This classic Red Velvet Cake is a beautiful, bright red sponge cake layered with a tangy cream cheese frosting. Perfect for any special occasion.', price: 250, pic: './imageoffood/RedVelvetCake.png' },
    { _id: "668a1e7f12c6d153f6fb0cdb", name: 'Cheesecake', description: 'Our Cheesecake has a crunchy graham cracker crust and is topped with your choice of fresh berries or a luscious fruit compote.', price: 250, pic: './imageoffood/Cheesecake.jpg' },
    { _id: "668a1e7f12c6d153f6fb0cdc", name: 'Strawberry Shortcake', description: 'Our Strawberry Shortcake is a light, fluffy sponge cake filled with fresh strawberries and whipped cream. A delightful, summery dessert.', price: 250, pic: './imageoffood/StrawberryShortcake.webp' },
  ];

  const [quantities, setQuantities] = useState({});
  const { addToCart } = useCart(); // Access addToCart from context

  const handleQuantityChange = (itemName, newQuantity) => {
    setQuantities({
      ...quantities,
      [itemName]: newQuantity
    });
  };

  const handleAddToCart = async (item) => {
    const quantity = quantities[item.name] || 1;

    try {
      // Fetch item details from backend
      const response = await axios.get(`http://localhost:4000/api/item/${item._id}`);
      const itemDetails = response.data;
      console.log("select items details:", itemDetails);

      // Add item to cart with quantity
      addToCart({ ...itemDetails, quantity });
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  return (
    <div className="cake-container">
      {items.map((item) => (
        <div className="cake-item" key={item._id}>
          <h1 className="cake-name">{item.name}</h1>
          <img src={item.pic} alt={item.name} className="cake-image" />
          <p className="cake-description">{item.description}</p>
          <p className="cake-price">₹{item.price}</p>
          <input
            type="number"
            min="1"
            value={quantities[item.name] || 1}
            onChange={(e) => handleQuantityChange(item.name, parseInt(e.target.value, 10))}
            className="quantity-input"
          />
          <button onClick={() => handleAddToCart(item)} className="add-to-cart-button">
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Cake;
