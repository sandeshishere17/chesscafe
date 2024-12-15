import React from 'react';

const itemdetail = ({ item }) => {
    if (!item) {
        return null; // If no item is provided, don't render anything
    }

    return (
        <div className="item-detail-container">
            <h2>{item.name}</h2>
            <img src={`/imageoffood/${encodeURIComponent(item.pic)}`} alt={item.name} />
            <p>{item.description}</p>
            <p className="price">Price: ${item.price.toFixed(2)}</p>
        </div>
    );
};

export default itemdetail;
