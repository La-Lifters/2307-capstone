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

const {
  createAddress,
  fetchAddresses
} = require('./address');


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
    DROP TABLE IF EXISTS addresses;
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
      rating INT,
      review TEXT,
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

    CREATE TABLE addresses(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      data JSON DEFAULT '{}',
      user_id UUID REFERENCES users(id) NOT NULL
    );

  `;
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', email: 'moe@email.com', password: '1234', is_admin: false }),
    createUser({ username: 'lucy', email: 'lucy@email.com', password: '1234', is_admin: false }),
    createUser({ username: 'ethyl', email: 'ethyl@email.com', password: '1234', is_admin: true }),
  ]);

  await createAddress({ user_id: ethyl.id, data: { formatted_address: 'Atlantic Ocean'}});

  const [iphoneImage, pixel8Image, razrImage,galaxy_flip, iphone14, galaxy_fold, galaxy_ultra , nokia_, xp3_, sidekick_, brick_, conch_, nokia2780_, oneplus11_, zenfone_, tcl_, lightphone_, iphone_se, google7_, edge_, nord_, a5_, iphone12_,razr1_] = await Promise.all([
    loadImage('images/iphone15.png'),
    loadImage('images/google_pixel8.png'),
    loadImage('images/razr.png'),
    loadImage('images/flip.png'),
    loadImage('images/iphone14.png'),
    loadImage('images/galaxy_fold.png'),
    loadImage('images/galaxy_ultra.png'),
    loadImage('images/nokia.png'),
    loadImage('images/xp3.png'),
    loadImage('images/sidekick.png'),
    loadImage('images/brick.png'),
    loadImage('images/conch.png'),
    loadImage('images/nokia-2780.png'),
    loadImage('images/oneplus-11.png'),
    loadImage('images/asus-zenfone-10.png'),
    loadImage('images/tcl.png'),
    loadImage('images/light-phone-2.png'),
    loadImage('images/iphone-se.png'),
    loadImage('images/google-pixle-7a.png'),
    loadImage('images/motorola-edge.png'),
    loadImage('images/nord.png'),
    loadImage('images/galaxy-a54.png'),
    loadImage('images/iphone-12.png'),
    loadImage('images/razr1.png')
  ]);

  let [apple, google, samsung, razr, iphone14_, fold, ultra, nokia, xp3, sidekick, brick, conch, nokia2780] = await Promise.all([
    createProduct({ name: 'apple', price: 1199, description: 'Etiam dignissim elit non leo bibendum mattis. Etiam arcu lacus, pulvinar quis molestie ac, finibus at nunc. Nullam aliquam pharetra leo, non tristique tellus egestas quis. Ut ex neque, mollis in tempus id, ultrices quis magna. Etiam elementum hendrerit ligula nec commodo. Pellentesque dolor libero, scelerisque quis commodo ut, porta consectetur est. Duis euismod sagittis efficitur. Etiam rhoncus turpis venenatis massa malesuada, in pretium orci cursus. Phasellus eget justo in urna consectetur suscipit. In ut dolor ex. Vestibulum tempor feugiat pretium. Vivamus pretium sapien est, ut auctor ante pharetra eu. Maecenas at rutrum eros. Aenean eu ipsum ipsum. Sed semper mollis ante. Fusce aliquet quis nisl id luctus.', rating: 3, review:'loreipsum' ,image: iphoneImage }),
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
    createProduct({ name: 'Magic Conch', price: 1  , description: 'The Conch knows all ', image: conch_ }),
    createProduct({ name: 'Nokia 2780 Flip', price: 97, description: 'Etiam dignissim elit non leo bibendum mattis.', rating: 5, review:'fermentum a augue non, rutrum rutrum felis.', image: nokia2780_ }),
    createProduct({ name: 'OnePlus 11', price: 900, description: "OnePlus 11 features: Processor: Qualcomm Snapdragon 8 Gen 2 | Display size: 6.7 inches | Storage options: Up to 256GB | Rear cameras: 50MP main, 48MP ultrawide, 32MP telephoto| Front camera: 16MP", rating: 6, review:"A slow-charging phone can be a real pain point, especially if you're always on the go. That's why the OnePlus 11 carves out its own best category, beating Apple, Google, and even Samsung when it comes to charging speed. The latest model comes with 100W SuperVooc fast charging or 80W in the US, which is still great.", image: oneplus11_ }),
    createProduct({ name: 'Asus Zenfone 10', price: 400, description: "Asus Zenfone 10 specs: Screen size: 5.9 inches | Storage: Up to 512GB | Processor: Qualcomm Snapdragon 8 Gen 2 | Panel type: AMOLED | Color: Black, Blue, Hazel, White, Red | Battery life: 4,300mAh | Water and dust resistant: IP68 ", rating: 7, review:" There's no denying that, over the past five years, smartphones have become more and more unwieldy. Apple now offers Plus and Max-sized iPhones, Samsung has an (Ultra) beast, and even Google has a foldable that opens up to 7.6 inches. On the other end of the spectrum sits the Asus Zenfone 10, a device that deviates from the norm in favor of ergonomics and in-hand comfort, and the decision pays off.", image:zenfone_ }),
    createProduct({ name: 'TCL Stylus 5G', price: 260, description: 'Etiam dignissim elit non leo bibendum mattis. ', rating: 3, review:'Repetative software bugs', image: tcl_ }),
    createProduct({ name: 'Light Phone 2', price: 300, description: 'Its a diffent kind of phone', rating: 3, review:"It's super light", image:lightphone_ }),
    createProduct({ name: 'iPhone SE', price: 500, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. ', rating: 4, review:"Best cheap iPhone", image: iphone_se }),
    createProduct({ name: 'Motorola Edge', price: 700, description: "Nulla id risus sed nisi gravida aliquet. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean tempor, mauris at tincidunt aliquet, libero ante sodales elit, a euismod turpis erat et nisl", rating: 6, review:"Best for watching video", image:edge_  }),
    createProduct({ name: 'OnePlus Nord', price: 300, description: 'Donec fringilla sodales eros. Nam cursus molestie sodales. ', rating: 7, review:"It's NORDIC", image:nord_ }),
    createProduct({ name: 'Galaxy A54', price: 200, description: 'Display: 6.4 inches (2340 x 1080)CPU: Exynos 1380RAM: 6GB, 8GBStorage / Expandable: 128GB, 256GB / YesRear camera: 50MP main (f/1.8), 12MP ultrawide (f/2.2), 5MP macro (f/2.4)Front camera: 32MP (f/2.2)Weight: 7.1 ounces', rating: 6, review:"The main camera is now the same 50MP shooter that Samsung uses on the more expensive Galaxy S23, and that helps the Galaxy A54 take on the Google Pixel 6a's impressive cameras. In head-to-head shots, the Galaxy A54 holds its own, even surpassing the output of the Pixel 6a in some cases, particularly when it comes to low-light shots.", image: a5_ }),
    createProduct({ name: 'Google pixel 7a', price: 300, description: 'Display: 6.1 inches (2400 x 1080)CPU: Tensor G2RAM: 8GBStorage / Expandable: 128GB / NoRear camera: 64MP main (f/1.89), 13MP ultrawide (f/2.2)Front camera: 13MP (f/2.2)Weight: 6.8 ounces', rating: 4, review:"It still costs less than $500 even though it runs on the same Tensor G2 chipset that powers the more expensive Pixel 7.", image: google7_ }),
    createProduct({ name: 'iphone 12', price: 400, description: ' Etiam fringilla, neque non tincidunt eleifend, ante felis accumsan nisi, ac vulputate orci metus nec neque. Ut auctor nulla in suscipit dignissim. Suspendisse pretium odio quis sapien egestas ultricies.', rating: 5, review:"Maecenas ut sapien enim", image: iphone12_}),
    createProduct({ name: 'Motorola RAZR', price: 20, description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vel gravida libero. Nam sagittis porta semper. Integer eget vulputate mauris. Sed sollicitudin dolor nec ex viverra pretium eu blandit nisl. ', rating: 8, review:"Etiam placerat ac ipsum vitae fermentum. Mauris id ex tristique, ornare purus a, suscipit felis. Etiam id luctus nisl. Praesent molestie bibendum velit, quis imperdiet elit ultricies ac", image: razr1_})


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
  fetchAddresses,
  createAddress,
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
