const client = require('./client');
const path = require('path');
const fs = require('fs');


const {
  fetchProducts,
  createProduct,
  updateProduct
} = require('./products');

const {
  createUser,
  authenticate,
  findUserByToken,
  updateProfile,
  updatePassword
} = require('./auth');

const {
  fetchLineItems,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  fetchOrders
} = require('./cart');

const{
  createBookmark,
  fetchBookmarks
} = require('./bookmarks');

const loadImage = (filePath) =>{
  return new Promise(( resolve, reject )=>{
    const fullPath = path.join( __dirname, filePath );
    fs.readFile( fullPath, 'base64', ( err, result )=>{
      if(err){
        reject(err);
      }else{
        resolve(`data:image/jpeg && image/png ; base64, ${result}`);
      }
    })
  })
}

const seed = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS bookmarks;
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      username VARCHAR(100) UNIQUE NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      is_admin BOOLEAN DEFAULT false NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL,
      price INTEGER NOT NULL,
      description TEXT,
      image TEXT
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id) NOT NULL
    );

    CREATE TABLE line_items(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      order_id UUID REFERENCES orders(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
    );

    CREATE TABLE bookmarks(
      id UUID PRIMARY KEY,
      product_id UUID REFERENCES products(id) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      product_name VARCHAR REFERENCES products(name) NOT NULL,
      CONSTRAINT product_and_user_key UNIQUE(product_id, user_id)
    );

  `;
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', email: 'moe@email.com', password: '1234', is_admin: false }),
    createUser({ username: 'lucy', email: 'lucy@email.com', password: '1234', is_admin: false }),
    createUser({ username: 'ethyl', email: 'ethyl@email.com', password: '1234', is_admin: true }),
  ]);

  const iphoneImage = await loadImage('images/iphone15.jpeg');
  const pixel8Image = await loadImage('images/google_pixel8.jpeg');

  let [apple, google, samsung] = await Promise.all([
    createProduct({ name: 'apple', price: 1199, description: 'This is the latest iPhone.', image: iphoneImage }),
    createProduct({ name: 'google', price: 1059, description: 'This is the latest Google Pixel phone.' }),
    createProduct({ name: 'samsung', price: 1199, description: 'This is the latest Samsung Galaxy phone.' }),
    createProduct({ name: 'motorola', price: 999, description: 'This is the latest version of the Motorola Edge.' }),
  ]);

  await Promise.all([
    createBookmark({ user_id: ethyl.id , product_id: samsung.id , product_name: samsung.name }),
    createBookmark({ user_id: ethyl.id , product_id: apple.id , product_name: apple.name }),
  ]);

  await updateProduct({...google, image: pixel8Image});
  let orders = await fetchOrders(ethyl.id);
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: apple.id});
  lineItem.quantity++;
  await updateLineItem(lineItem);
  lineItem = await createLineItem({ order_id: cart.id, product_id: google.id});
  cart.is_cart = false;
  await updateOrder(cart);
};

module.exports = {
  createBookmark,
  fetchBookmarks,
  fetchProducts,
  fetchOrders,
  fetchLineItems,
  createLineItem,
  updateLineItem,
  updateProduct,
  deleteLineItem,
  updateOrder,
  authenticate,
  findUserByToken,
  updateProfile,
  updatePassword,
  seed,
  client
};
