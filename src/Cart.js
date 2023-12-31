import React from 'react';
import axios from 'axios';
import api from './api';

const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products, setLineItems })=> {
  let cartTotal = 0;

  const increaseQuantity = async(lineItem)=> {
    const newQuantity = lineItem.quantity + 1;
    const response = await axios.put(`/api/lineItems/${ lineItem.id }`, { quantity: newQuantity }, api.getHeaders() );
    const newLineItems = lineItems.map(lineItemMap => {
      if(lineItemMap.id === lineItem.id) {
        return response.data;
      } else {
        return lineItemMap;
      }
    });
    setLineItems(newLineItems);
  };

  const decreaseQuantity = async(lineItem)=> {
    let newQuantity = lineItem.quantity - 1;
    
    newQuantity = Math.max(newQuantity, 0);
    if(newQuantity === 0) {
      removeFromCart(lineItem);
    } else {
    const response = await axios.put(`/api/lineItems/${ lineItem.id }`, { quantity: newQuantity }, api.getHeaders());
    const newLineItems = lineItems.map(lineItemMap => {
      if(lineItemMap.id === lineItem.id) {
        return response.data;
      } else {
        return lineItemMap;
      }
    });
    setLineItems(newLineItems);
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {
          lineItems.filter(lineItem=> lineItem.order_id === cart.id).map( lineItem => {
            const product = products.find(product => product.id === lineItem.product_id) || {};
            cartTotal += product.price * lineItem.quantity;
            return (
              <li key={ lineItem.id }>
                { product.name }
                ({ lineItem.quantity })
                <button onClick={ ()=> removeFromCart(lineItem)}>Remove From Cart</button>
                <button onClick={ ()=> increaseQuantity(lineItem) }>
                  +
                </button>
                <button onClick={ ()=> decreaseQuantity(lineItem) }>
                  -
                </button>
              </li>
            );
          })
        }
      </ul>
      <p>Total: ${ cartTotal.toLocaleString("en-US") }</p>
      {
        lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <button onClick={()=> {
          updateOrder({...cart, is_cart: false });
        }}>Create Order</button>: null
      }
    </div>
  );
};

export default Cart;
