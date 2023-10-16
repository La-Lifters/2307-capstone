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
  findUserByToken
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


  const [iphoneImage, pixel8Image, razrImage,galaxy_flip, iphone14, galaxy_fold, galaxy_ultra , nokia_, xp3_, sidekick_, brick_, conch_] = await Promise.all([
    loadImage('images/iphone15.png'),
    loadImage('images/google_pixel8.png'),
    loadImage('images/razr.png'),
    loadImage('images/flip.png'),
    loadImage('images/iphone14.png'),
    loadImage('images/galaxy_fold.png'),
    loadImage('images/galaxy_ultra.png'),
    loadImage('images/_nokia.jpeg'),
    loadImage('images/xp3.png'),
    loadImage('images/sidekick.png'),
    loadImage('images/brick.jpeg'),
    loadImage('images/conch.jpeg')
  ]);
  

  let [apple, google, samsung, razr, iphone14_, fold, ultra, nokia, xp3, sidekick, brick, conch] = await Promise.all([
    createProduct({ name: 'apple', price: 1199, description: 'This is the latest iPhone.', image: iphoneImage }),
    createProduct({ name: 'google', price: 1059, description: 'This is the latest Google Pixel phone.' }),
    createProduct({ name: 'samsung', price: 1199, description: 'This is the latest Samsung Galaxy phone.', image: galaxy_flip }),
    createProduct({ name: 'motorola', price: 999, description: 'This is the latest version of the Motorola Edge.', image: razrImage }),
    createProduct({ name: 'iPhone 14 ', price: 1000 , description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', image: iphone14 }),
    createProduct({ name: 'Galaxy Fold ', price: 1111 , description: 'Etiam sed facilisis quam. ', image: galaxy_fold}),
    createProduct({ name: 'Galaxy Ultra ', price: 1259 , description: 'Quisque a massa lacinia, condimentum nisl id, ultrices nisi. ', image: galaxy_ultra }),
    createProduct({ name: 'Nokia 1100 ', price: 75 , description: ' If you know you know', image: nokia_ }),
    createProduct({ name: 'XP3 ', price: 100 , description: 'Sed dignissim mauris in nisl convallis posuere. ', image: xp3_ }),
    createProduct({ name: 'SideKick2 ', price: 200 , description: 'Nunc aliquet feugiat dui, ut congue lorem luctus at.', image: sidekick_ }),
    createProduct({ name: 'Miami Vice', price: 10 , description: 'Quisque non quam rhoncus, scelerisque elit a, mollis mi. ', image: brick_ }),
    createProduct({ name: 'Magic Conch', price: 1  , description: 'The Conch knows all ', image: conch_ })
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
  seed,
  client
};
