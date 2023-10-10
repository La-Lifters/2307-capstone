import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Wishlist = ({ auth }) => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(`/api/users/${auth.id}/wishlist`);
        setWishlist(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWishlist();
  }, [auth.id]);

  const removeFromWishlist = async (wishlistId) => {
    try {
      await axios.delete(`/api/wishlist/${wishlistId}`);
      setWishlist(wishlist.filter(item => item.id !== wishlistId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      <ul>
        {wishlist.map(item => (
          <li key={item.id}>
            {item.product.name}
            <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Wishlist;
