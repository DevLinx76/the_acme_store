// server/db.js

// client - a node pg client
const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_store_db');
const uuid = require('uuid');
const bcrypt = require('bcrypt');



// createTables method - drops and creates the tables for your application
const createTables = async () => {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
        id UUID PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
    );
    CREATE TABLE products(
        id UUID PRIMARY KEY,
        name VARCHAR(255) NOT NULL
    );
    CREATE TABLE favorites(
        id UUID PRIMARY KEY,
        product_id UUID REFERENCES products(id) NOT NULL,
        user_id UUID REFERENCES users(id) NOT NULL,
        CONSTRAINT unique_user_id_product_id UNIQUE (user_id, product_id)
    );
    `;
    await client.query(SQL);
};

// createProduct - creates a product in the database and returns the created record
const createProduct = async ({ name }) => {
    const response = await client.query(
        'INSERT INTO products(id, name) VALUES($1, $2) RETURNING *',
        [uuid.v4(), name]
    );
    return response.rows[0];
};

// createUser - creates a user in the database and returns the created record. The password of the user should be hashed using bcrypt.
const createUser = async ({ username, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await client.query(
        'INSERT INTO users(id, username, password) VALUES($1, $2, $3) RETURNING *', 
        [uuid.v4(), username, hashedPassword]
    );
    return response.rows[0];
};

// fetchUsers - returns an array of users in the database
const fetchUsers = async () => {
    const SQL = 'SELECT id, username FROM users';
    const response = await client.query(SQL);
    return response.rows;
};

// fetchProducts - returns an array of products in the database
const fetchProducts = async () => {
    const SQL = 'SELECT * FROM products';
    const response = await client.query(SQL);
    return response.rows;
};

// fetchFavorites - returns an array favorites for a user
const fetchFavorites = async (userId) => {
    const SQL = 'SELECT * FROM favorites WHERE user_id = $1';
    const response = await client.query(SQL, [userId]);
    return response.rows;
};

// createFavorite - creates a favorite in the database and returns the created record
const createFavorite = async ({ userId, productId }) => {
    const response = await client.query(
        'INSERT INTO favorites(id, user_id, product_id) VALUES($1, $2, $3) RETURNING *',
        [uuid.v4(), userId, productId]
    );
    return response.rows[0];
};

// destroyFavorite - deletes a favorite in the database
const destroyFavorite = async ({ userId, id }) => {
    const SQL = 'DELETE FROM favorites WHERE user_id = $1 AND id = $2';
    await client.query(SQL, [userId, id]);
};

// export the client and methods
module.exports = {
    client,
    createTables,
    createFavorite,
    createProducts,
    createUser,
    fetchFavorites,
    fetchUsers,
    fetchProducts,
    destroyFavorite
}
