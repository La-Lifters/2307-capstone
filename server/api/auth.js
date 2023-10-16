const {
  authenticate,
  findUserByToken
} = require('../db');

const express = require('express');
const app = express.Router();
const { isLoggedIn } = require('./middleware');
const { createUser } = require('../db/auth');
const { updateProfile } = require('../db/auth');
const { updatePassword } = require('../db/auth');

app.post('/login', async(req, res, next)=> {
  try {
    const token = await authenticate(req.body);
    res.send({ token });
  }
  catch(ex){
    next(ex);
  }
});


app.get('/me', isLoggedIn, async(req, res, next)=> {
  try {
    const userData = await findUserByToken(req.headers.authorization);
    res.json(userData);
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


app.put('/me/update', isLoggedIn, async(req, res, next)=> {
  const { username, email } = req.body;
  const userId  = req.user.id;
  try {
    await updateProfile(userId, { username, email });
    res.status(200).send('Profile successfully updated');
  } catch (ex) {
    next(ex);
  }
});


app.put('/me/updatePassword', isLoggedIn, async(req, res, next)=> {
  const { newPassword } = req.body;
  const userId = req.user.id;
  try {
    await updatePassword(userId, newPassword);
    res.status(200).send('Password successfully updated');
  } catch (ex) {
    next(ex);    
  }
});

module.exports = app;