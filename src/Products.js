import React from 'react';

import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductImageEditor from './ImageEditor';
  
const Products = ({ products, cartItems, createLineItem, updateLineItem, auth, updateProduct})=> {
  const navigate = useNavigate();
  const { term } = useParams();


  return (
    <div>
      <h2>Products</h2>
      <input 
      placeholder='search for products' 
      value={ term || '' } 
      onChange={ ev => navigate(ev.target.value ? `/products/search/${ev.target.value}` : '/products')} />
      <ul id = 'products_list'>
        {
          products
          .filter(product => !term || product.name.indexOf(term) !== -1)
          .map( product => {
            const cartItem = cartItems.find(lineItem => lineItem.product_id === product.id);
            return (
              <li id = 'products_li' key={ product.id }>
                { product.image ? <img src = {product.image}/> : null }
                <Link id = 'product_link' to = {`/product/${product.id}`}>{ product.name }</Link>
                {' '} {'$' + (product.price).toLocaleString("en-US") } {' '}
                <p>{ product.description }</p>
                {
                  auth.id ? (
                    cartItem ? <button onClick={ ()=> updateLineItem(cartItem)}>Add Another</button>: <button onClick={ ()=> createLineItem(product)}>Add</button>
                  ): null 
                }
                {
                  auth.is_admin ? (
                    <div className='products_admin'>
                    <Link to={`/products/${product.id}/edit`} >Edit</Link>
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
