import React from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const Products = ({ products, cartItems, createLineItem, updateLineItem, auth})=> {
  const navigate = useNavigate();
  const { term } = useParams();

  return (
    <div>
      <h2>Products</h2>
      <input 
      placeholder='search for products' 
      value={ term || '' } 
      onChange={ ev => navigate(ev.target.value ? `/products/search/${ev.target.value}` : '/products')} />
      <ul>
        {
          products
          .filter(product => !term || product.name.indexOf(term) !== -1)
          .map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li key={ product.id }>
                <Link to = {`/product/${product.id}`}>{ product.name }</Link>
                {' '} {'$' + (product.price).toLocaleString("en-US") } {' '}
                <p>{ product.description }</p>
                {
                  auth.id ? (
                    cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add</button>
                  ): null 
                }
                {
                  auth.is_admin ? (
                    <Link to={`/products/${product.id}/edit`}>Edit</Link>
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
