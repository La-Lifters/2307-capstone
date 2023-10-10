import React from 'react';
import { Link } from 'react-router-dom';

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth})=> {

  const addToWishlist = async (productId) => {
    try {
      await axios.post('/api/wishlist', { userId: auth.id, productId });
      // Optionally update UI
    } catch (err) {
      console.error(err);
    }
  };
  
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {
          products.map(product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={product.id}>
                <Link to={`/product/${product.id}`}>{product.name}</Link>
                {' '} {'$' + (product.price).toLocaleString("en-US")} {' '}
                <p>{product.description}</p>
                {
                  auth.id ? (
                    cartItem ? <button onClick={() => updateLineItem(cartItem)}>Add Another</button> : <button onClick={() => createLineItem(product)}>Add</button>
                  ) : null
                }
                {
                  auth.is_admin ? (
                    <Link to={`/products/${product.id}/edit`}>Edit</Link>
                  ) : null
                }
                {
                  auth.id ? (
                    <button onClick={() => addToWishlist(product.id)}>Add to Wishlist</button>
                  ) : null
                }
              </li>
            );
          })
        }
      </ul>
    </div>
  );
  
};

export default Products;
