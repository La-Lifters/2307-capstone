const {
    fetchBookmarks, 
    createBookmark
  } = require('../db');
  
  const express = require('express');
  const app = express.Router();
  const { isLoggedIn, isAdmin } = require('./middleware');
  
  app.post('/', isLoggedIn, async(req, res, next)=> {
    try {
      res.send(await createBookmark({ ...req.body, id: req.params.id}));
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/', isLoggedIn, async(req, res, next)=> {
    try {
      res.send(await fetchBookmarks(req.user.id));
    }
    catch(ex){
      next(ex);
    }
  });
  
  module.exports = app;