// server/index.js

const{
    client,
    createTables,    
    createProduct,
    createUser,    
    fetchUsers,
    fetchProducts,
    fetchFavorites,
    createFavorite,
    destroyFavorite
} = require('./db');
const express = require('express');
const app = express();
app.use(express.json());

// Client connects to the database
client.connect();

// create tables in the database
app.post('/api/tables', async(req, res, next)=> {
    try {
      res.send(await createTables());
    }
    catch(ex){
      next(ex);
    }
} );

// POST /api/products - payload: a name returns the created product with a status code of 201
app.post('/api/products', async(req, res, next)=> {
    try {
      res.status(201).send(await createProduct({ name: req.body.name }));
    }
    catch(ex){
      next(ex);
    }
});

// POST /api/users - payload: a username and password returns the created user with a status code of 201
app.post('/api/users', async(req, res, next)=> {
    try {
      res.status(201).send(await createUser({ username: req.body.username, password: req.body.password }));
    }
    catch(ex){
      next(ex);
    }
});

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

// POST /api/users/:id/favorites - payload: a product_id returns the created favorite with a status code of 201
app.post('/api/users/:id/favorites', async(req, res, next)=> {
    try {
      res.status(201).send(await createFavorite({ user_id: req.params.id, product_id: req.body.product_id}));
    }
    catch(ex){
      next(ex);
    }
});

// Error handler
app.use((err, req, res, next)=> {
    console.log(err);
    res.status(err.status || 500).send({ error: err.message || err });
} );


const init = async()=> {
    console.log('connecting to database...');
    await client.connect();
    console.log('connected to database'); 
    await createTables();
    console.log('tables created');
    const [milk, eggs, cheese, bread] = await Promise.all([
        createProduct({ name: 'milk' }),
        createProduct({ name: 'eggs' }),
        createProduct({ name: 'cheese' }),
        createProduct({ name: 'bread' })
    ]);
    console.log('tables created');
    const [alice, bob, devin, cindy] = await Promise.all([
        createUser({ username: 'alice', password: '123' }),
        createUser({ username : 'bob', password: '456' }),
        createUser({ username: 'devin', password: '789' }),
        createUser({ username: 'cindy', password: '101112'})
    ]);
    console.log('users created');
    console.log('creating favorites');

    const userFavorites = await Promise.all([
        createFavorite({ user_id: alice.id, product_id: milk.id }),
        createFavorite({ user_id: bob.id, product_id: eggs.id }),
        createFavorite({ user_id: devin.id, product_id: cheese.id }),
        createFavorite({ user_id: cindy.id, product_id: bread.id })
    ]);
    console.log('data seeded');

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> {
        console.log(`listening on port ${port}`);
    });
}


