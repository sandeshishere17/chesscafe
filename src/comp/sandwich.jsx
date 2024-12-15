import React, { useState } from 'react';
import axios from 'axios';
import { useCart } from './cartcontext'; // Import the useCart hook
import './sandwich.css';

function Sandwich() {
  const items = [
    { _id: "668a1e7f12c6d153f6fb0cdd", name: "Egg Sandwich", description: "Made with egg", price: 175, pic: './imageoffood/eggsandwich.jpg' },
    { _id: "66b5bffbf9cae87e44c388a0", name: "Grilled Cheese Sandwich", description: "Classic sandwich with melted cheese between slices of buttered bread, grilled to perfection.", price: 1200, pic: './imageoffood/grilledcheese.avif' },
    { _id: "66b5bffbf9cae87e44c388a1", name: "Veggie Delight Sandwich", description: "A fresh and healthy sandwich packed with a variety of vegetables and a hint of hummus.", price: 130, pic: './imageoffood/veggiedelight.jpg' },
    { _id: "66b5bffbf9cae87e44c388a2", name: "Chicken Club Sandwich", description: "A hearty sandwich with layers of grilled chicken, bacon, lettuce, tomato, and mayonnaise.", price: 200, pic: './imageoffood/ChickenClubSandwich.avif' },
    { _id: "66b5bffbf9cae87e44c388a3", name: "Paneer Tikka Sandwich", description: "A flavorful sandwich filled with marinated paneer tikka, onions, and bell peppers, served in toasted bread.", price: 180, pic: './imageoffood/paneertikka.avif' }
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
      console.log("select items details:",itemDetails)

      // Add item to cart with quantity
      addToCart({ ...itemDetails, quantity });
    } catch (error) {
      console.error('Error fetching item details:', error);
    }
  };

  return (
    <div className='sandwich_container'>
      {items.map((item) => (
        <div className='sandwich-item' key={item._id}>
          <h1 className='name'>{item.name}</h1>
          <img src={item.pic} alt={item.name} className="sandwich-image" />
          <p className='desc'>{item.description}</p>
          <p className='pri'>₹{item.price}</p>
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

export default Sandwich;
