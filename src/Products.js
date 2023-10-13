import React from 'react';
import { Link } from 'react-router-dom';
import ProductImageEditor from './ImageEditor';

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth, updateProduct})=> {
  return (
    <div>
      <h2>Products</h2>
      <ul>
        {
          products.map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={ product.id }>
                <Link to = {`/product/${product.id}`}>{ product.name }</Link>
                { product.image ? <img src = {product.image}/> : null }
                {' '} {'$' + (product.price).toLocaleString("en-US") } {' '}
                <p>{ product.description }</p>
                {
                  auth.id ? (
                    cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add</button>
                  ): null 
                }
                {
                  auth.is_admin ? (
                    <div>
                    <Link to={`/products/${product.id}/edit`}>Edit</Link>
                    <ProductImageEditor product = { product } updateProduct = { updateProduct }/>
                    </div>
                  ): null
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
