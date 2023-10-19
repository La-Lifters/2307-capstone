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
import Contact from './Contact';
import {FaShoppingCart, FaInstagram, FaTwitter, FaFacebookSquare, FaGithub, FaYoutube} from 'react-icons/fa';








const App = ()=> {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [menu,setMenu] = useState([]);
  const [addresses, setAddresses] = useState([]);
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

  useEffect(() => {
    if(auth.id){
      const fetchData = async() => {
        await api.fetchAddresses(setAddresses);
      };
      fetchData();
    }
  }, [auth]);

  const createLineItem = async(product)=> {
    await api.createLineItem({ product, cart, lineItems, setLineItems});
  };

  const createAddress = async(address) => {
    await api.createAddress({ address, setAddresses });
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

  const updateAuth = (newAuth)=> {
    setAuth(newAuth);
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
          <div>
            <nav>

              <Link className='Nav-link' to='/products' onClick={()=>{setMenu('products')}}>Products ({ products.length }){menu === 'products' ? <hr/> :<></>}</Link>
              <Link className='Nav-link' to='/orders' onClick={()=>{setMenu('orders')}}>Orders ({ orders.filter(order => !order.is_cart).length }){menu === 'orders' ? <hr/> :<></>}</Link>
              <Link className='Nav-link' to='/cart' onClick={()=>{setMenu('cart')}}><FaShoppingCart style={{width:25, height:25}}/>({ cartCount }){menu === 'cart' ? <hr/> :<></>}</Link>
              <Link className='Nav-link' to='/profile' onClick={()=>{setMenu('profile')}}>Profile{menu === 'profile' ? <hr/> :<></>}</Link>
              <Link className='Nav-link' to='/contact' onClick={()=>{setMenu('contact')}}>Contact{menu === 'contact' ? <hr/> :<></>}</Link>

              <span>
                Welcome { auth.username}!<br/>
                <button id='logout' onClick={ logout }>Logout</button>
              </span>
            </nav>
            <body>
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
                updateAuth = { updateAuth }
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
                <Contact createAddress={ createAddress } addresses={ addresses } />
              }
              />
            </Routes>
            </body>
            <footer>
              <span className='footer-txt'>
                <p>Follow us at: </p>
              </span>
              <div className='footer-links'>
              <Link className='footer-icon' to={'https://www.instagram.com/'}><FaInstagram style={{height:50, width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.twitter.com'}><FaTwitter style={{height:50, width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.facebook.com'}><FaFacebookSquare style={{height:50, width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.github.com'}><FaGithub style={{height:50,width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.youtube.com'}><FaYoutube style={{height:50,width:50}}/></Link>
              </div>
            </footer>
            
          </div>
        ):(
          <div>

            <nav>
            <Link className='Nav-link' to='/products'onClick={()=>{setMenu('products')}}>Products ({ products.length }){menu === 'products' ? <hr/> :<></>}</Link>
            <Link className='Nav-link' to='/login' onClick={()=>{setMenu('login')}}>Login {menu === 'login' ? <hr/> : <></>}</Link>
            <Link className='Nav-link' to='/contact' onClick={()=>{setMenu('contact')}}>Contact{menu === 'contact' ? <hr/> :<></>}</Link>

            </nav>
            <body>
            <Routes>

<Route path='/login' element={
  <Login 
  login={ login }
  register={ register }
  />
}/>

<Route path='/register' element={
  <Registration
  register={register}/>
}/>


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

  <Route path='/contact'
     element = {
      <Contact/>
      }
   />
</Routes>
            </body>
            <footer>
              <span className='footer-txt'>
                <p>Follow us at: </p>
              </span>
              <div className='footer-links'>
              <Link className='footer-icon' to={'https://www.instagram.com/'}><FaInstagram style={{height:50, width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.twitter.com'}><FaTwitter style={{height:50, width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.facebook.com'}><FaFacebookSquare style={{height:50, width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.github.com'}><FaGithub style={{height:50,width:50}}/></Link>
              <Link className='footer-icon' to={'https://www.youtube.com'}><FaYoutube style={{height:50,width:50}}/></Link>
              </div>
            </footer>
          </div>
        )
      }
    </div>
  );
};

const root = ReactDOM.createRoot(document.querySelector('#root'));
root.render(<HashRouter><App /></HashRouter>);