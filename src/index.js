import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Link, HashRouter, Routes, Route } from 'react-router-dom';
import Products from './Products';
import Orders from './Orders';
import Cart from './Cart';
import Login from './Login';
import api from './api';
import Profile from './Profile';
import Registration from './Registration';
import Product from './Product';
import Contact from './contact';


const App = ()=> {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [auth, setAuth] = useState({});

  const attemptLoginWithToken = async()=> {
    await api.attemptLoginWithToken(setAuth);
  }

  useEffect(()=> {
    attemptLoginWithToken();
  }, []);

  useEffect(()=> {
    const fetchData = async()=> {
      await api.fetchProducts(setProducts);
    };
    fetchData();
  }, []);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchOrders(setOrders);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchLineItems(setLineItems);
      };
      fetchData();
    }
  }, [auth]);

  useEffect(()=> {
    if(auth.id){
      const fetchData = async()=> {
        await api.fetchBookmarks(setBookmarks);
      };
      fetchData();
    }
  }, [auth]);


  const createLineItem = async(product)=> {
    await api.createLineItem({ product, cart, lineItems, setLineItems});
  };

  const createBookmark = async(product) =>{
    console.log(product)
    await api.createBookmark({ product, setBookmarks, bookmarks })
  };

  const updateLineItem = async(lineItem)=> {
    await api.updateLineItem({ lineItem, cart, lineItems, setLineItems });
  };

  const updateProduct = async(product)=> {
    await api.updateProduct({ product, products, setProducts });
  };

  const updateOrder = async(order)=> {
    await api.updateOrder({ order, setOrders });
  };

  const removeFromCart = async(lineItem)=> {
    await api.removeFromCart({ lineItem, lineItems, setLineItems });
  };

  const cart = orders.find(order => order.is_cart) || {};

  const cartItems = lineItems.filter(lineItem => lineItem.order_id === cart.id);

  const cartCount = cartItems.reduce((acc, item)=> {
    return acc += item.quantity;
  }, 0);

  const login = async(credentials)=> {
    await api.login({ credentials, setAuth });
  }

  const register = async (user) => {
    await api.register(user);
  }

  const logout = ()=> {
    api.logout(setAuth);
  }

  return (
    <div>
      {
        auth.id ? (
          <>
            <nav>
              <Link to='/products'>Products ({ products.length })</Link>
              <Link to='/orders'>Orders ({ orders.filter(order => !order.is_cart).length })</Link>
              <Link to='/cart'>Cart ({ cartCount })</Link>
              <Link to='/profile'>Profile</Link>
              <Link to='/contact'>Contact</Link>

              <span>
                Welcome { auth.username }!
                <button onClick={ logout }>Logout</button>
              </span>
              
            </nav>
            <Routes>
            <Route path = '/products'
              element = {
              <Products
                auth = { auth }
                products={ products }
                cartItems = { cartItems }
                createLineItem = { createLineItem }
                updateLineItem = { updateLineItem }
              />
              } />

              <Route path = '/products/search/:term'
              element = {
              <Products
                auth = { auth }
                products={ products }
                cartItems = { cartItems }
                createLineItem = { createLineItem }
                updateLineItem = { updateLineItem }
                updateProduct={ updateProduct }
              />
              } />

              <Route path = '/cart'
              element = {
                <Cart
                cart = { cart }
                lineItems = { lineItems }
                products = { products }
                updateOrder = { updateOrder }
                removeFromCart = { removeFromCart }
                setLineItems = { setLineItems }
              />
              }/>

              <Route path = '/orders'
              element = {
              <Orders
                orders = { orders }
                products = { products }
                lineItems = { lineItems }
              />
              }/>

              <Route path='/profile'
              element = {
                <Profile
                auth = { auth }
                bookmarks = { bookmarks }
                products = {products}
                />
              }/>

              <Route path = '/product/:id'
              element = {
                <Product
                products = { products }
                createBookmark = { createBookmark }
                auth={ auth }
                />
              }
              />

              <Route path='/contact'
              element = {
                <Contact/>
              }
              />
            </Routes>
            </>
        ):(
          <div>
            <Login login={ login }/>
            <Registration register={register} />
            <Routes>
              <Route path='/' element={
                <Products
                  products={ products }
                  cartItems = { cartItems }
                  createLineItem = { createLineItem }
                  updateLineItem = { updateLineItem }
                  auth = { auth }
                  bookmarks = { bookmarks }
                />
              } />

              <Route path='/products' element={
                <Products
                  products={ products }
                  cartItems = { cartItems }
                  createLineItem = { createLineItem }
                  updateLineItem = { updateLineItem }
                  auth = { auth }
                  bookmarks = { bookmarks }
                />
              } />

              <Route path='/products/search/:term' element={
                <Products
                  products={ products }
                  cartItems = { cartItems }
                  createLineItem = { createLineItem }
                  updateLineItem = { updateLineItem }
                  auth = { auth }
                  bookmarks = { bookmarks }
                />
              } />

              <Route path = '/product/:id'
                element = {
                <Product
                products = { products }
                createBookmark = { createBookmark }
                auth={ auth }
                />
              }
              />
            </Routes>
          </div>
        )
      }
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);