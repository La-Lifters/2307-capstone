import axios from 'axios';

const getHeaders = ()=> {
  return {
    headers: {
      authorization: window.localStorage.getItem('token')
    }
  };
};

const fetchProducts = async(setProducts)=> {
  const response = await axios.get('/api/products');
  setProducts(response.data);
};

const fetchOrders = async(setOrders)=> {
  const response = await axios.get('/api/orders', getHeaders());
  setOrders(response.data);
};

const fetchLineItems = async(setLineItems)=> {
  const response = await axios.get('/api/lineItems', getHeaders());
  setLineItems(response.data);
};

const fetchBookmarks = async(setBookmarks)=> {
  const response = await axios.get('/api/bookmarks', getHeaders());
  setBookmarks(response.data);
};

const createBookmark = async({ product, bookmarks, setBookmarks})=> {
  const response = await axios.post('/api/bookmarks', {
    product_id: product.product.id,
    user_id : product.auth.id,
    product_name: product.product.name
  }, getHeaders());
  setBookmarks([...bookmarks, response.data]);
};

const createLineItem = async({ product, cart, lineItems, setLineItems })=> {
  const response = await axios.post('/api/lineItems', {
    order_id: cart.id,
    product_id: product.id
  }, getHeaders());
  setLineItems([...lineItems, response.data]);
};

const updateLineItem = async({ lineItem, cart, lineItems, setLineItems })=> {
  const response = await axios.put(`/api/lineItems/${lineItem.id}`, {
    quantity: lineItem.quantity + 1,
    order_id: cart.id
  }, getHeaders());
  setLineItems(lineItems.map( lineItem => lineItem.id == response.data.id ? response.data: lineItem));
};

const updateProduct = async({ product, products, setProducts })=> {
  const response = await axios.put(`/api/products/${product.id}`, product, getHeaders());
  setProducts(products.map( product => product.id == response.data.id ? response.data: product));
};

const updateOrder = async({ order, setOrders })=> {
  await axios.put(`/api/orders/${order.id}`, order, getHeaders());
  const response = await axios.get('/api/orders', getHeaders());
  setOrders(response.data);
};

const updateProfile = async(username, email)=> {
  try {
    await axios.put('/api/me/update', { username, email }, getHeaders());
    console.log('Profile updated successfully');
  } catch (error) {
    console.error('Profile update failed:', error);
    throw error;
  }
};

const updatePassword = async (newPassword) => {
  try {
    await axios.put('/api/me/updatePassword', { newPassword }, getHeaders());
    console.log('Password updated successfully');
  } catch (error) {
    console.error('Password update failed:', error);
    throw error;
  }
};

const removeFromCart = async({ lineItem, lineItems, setLineItems })=> {
  const response = await axios.delete(`/api/lineItems/${lineItem.id}`, getHeaders());
  setLineItems(lineItems.filter( _lineItem => _lineItem.id !== lineItem.id));
};

const attemptLoginWithToken = async(setAuth)=> {
  const token = window.localStorage.getItem('token');
  if(token){
    try {
      const response = await axios.get('/api/me', getHeaders());
      setAuth(response.data);
    }
    catch(ex){
      if(ex.response.status === 401){
        window.localStorage.removeItem('token');
      }
    }
  }
}

const login = async({ credentials, setAuth })=> {
  const response = await axios.post('/api/login', credentials);
  const { token } = response.data;
  window.localStorage.setItem('token', token);
  attemptLoginWithToken(setAuth);
}

const register = async (user) => {
  try {
    const response = await axios.post('/api/register', user);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response);
    throw error;
  }
};

const logout = (setAuth)=> {
  window.localStorage.removeItem('token');
  setAuth({});
}

const api = {
  login,
  register,
  logout,
  fetchProducts,
  updateProduct,
  fetchOrders,
  fetchLineItems,
  fetchBookmarks,
  createBookmark,
  createLineItem,
  updateLineItem,
  updateOrder,
  updateProfile,
  updatePassword,
  removeFromCart,
  attemptLoginWithToken,
  getHeaders
};

export default api;
