import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Wishlist = ({ auth }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const { data } = await axios.get(`/api/users/${auth.id}/wishlist`);
        setWishlist(data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch wishlist. Please try again later.');
      } finally {
        setLoading(false);
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
      setError('Failed to remove item from wishlist. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Your Wishlist</h2>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && (
        <ul>
          {wishlist.length ? (
            wishlist.map(item => (
              <li key={item.id}>
                {item.product.name}
                <button onClick={() => removeFromWishlist(item.id)}>Remove</button>
              </li>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Wishlist;
