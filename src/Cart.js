import React from 'react';
import axios from 'axios';
import api from './api';

const Cart = ({ updateOrder, removeFromCart, lineItems, cart, products, setLineItems })=> {

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

  const totalPrice = lineItems.filter(lineItem => lineItem.order_id === cart.id)
    .reduce((total, lineItem) => {
      const product = products.find(product => product.id === lineItem.product_id) || {};
      return total + (product.price * lineItem.quantity);
    }, 0);

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {
          lineItems.filter(lineItem=> lineItem.order_id === cart.id).map( lineItem => {
            const product = products.find(product => product.id === lineItem.product_id) || {};
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
      <h3>Total Price: ${totalPrice}</h3> {/* Displaying total price here */}
      {
        lineItems.filter(lineItem => lineItem.order_id === cart.id ).length ? <button onClick={()=> {
          updateOrder({...cart, is_cart: false });
        }}>Create Order</button>: null
      }
    </div>
  );
};

export default Cart;

