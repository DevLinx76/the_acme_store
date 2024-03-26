// server/index.js

const{
    client,
    createTables,
    createFavorite,
    createProducts,
    createUser,
    fetchFavorites,
    fetchUsers,
    fetchProducts,
    destroyFavorite
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

// GET /api/users - returns array of users
app.get('/api/users', async(req, res, next)=> {
    try {
      res.send(await fetchUsers());
    }
    catch(ex){
      next(ex);
    }
  });
// GET /api/products - returns an array of products
app.get('/api/products', async(req, res, next)=> {
    try {
      res.send(fetchProducts());
    }
    catch(ex){
      next(ex);
    }
  });
// GET /api/users/:id/favorites - returns an array of favorites for a user
app.get('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.send(await fetchFavorites());
    }
    catch(ex){
      next(ex);
    }
  });
// POST /api/users/:id/favorites - payload: a product_id returns the created favorite with a status code of 201
app.post('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
  });
// DELETE /api/users/:userId/favorites/:id - deletes a favorite for a user, returns nothing with a status code of 204
app.delete('/api/users/:user_id/favorites/:id', async(req, res, next)=> {
    try {
      await destroyFavorite({user_id: req.params.user_id, id: req.params.id });
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });