try{
  require('../env');
}catch(ex){
  console.log(' if not displaying add env.js to root && set process.env.GOOGLE_API && npm i ejs');
}
const {
  seed,
  client,
} = require('./db');
const app = require('./app');

const init = async()=> {
  await client.connect();
  console.log('connected to database');
  if(process.env.SYNC){
    await seed();
    console.log('create your tables and seed data');
  }

  const port = process.env.PORT || 3000;
  app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
  });
}

init();
