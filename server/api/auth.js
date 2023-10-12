const {
  authenticate,
  findUserByToken
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');
const { createUser } = require('../db/auth');

app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});


app.get('/me', isLoggedIn, (req, res, next)=> {
  try {
    res.send(req.user);
  } 
  catch(ex){
    next(ex);
  }
});


app.post('/register', async(req, res, next)=> {
  const { username, email, password } = req.body;

  if (!username || !email || !password){
    res.status(400).send('Invalid Credentails. All fields are required.');
    return;
  }

  try {
    const newUser = await createUser({ username, email, password });
    res.send({ user: newUser });
  } 
  catch(ex){
    next(ex);
  }
});

module.exports = app;