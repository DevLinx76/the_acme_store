# The Acme Store

## Overview

This workshop focuses on constructing a RESTful API with a dedicated data layer, designed to manage users, products, and facilitate users to mark products as their favorites. 

## Getting Started

- Clone the repository and navigate into the directory.
- Install the necessary dependencies with npm.
- Set up the PostgreSQL database and configure the environment variables for the database connection.
- Initialize the database with the provided schema and seed data as necessary.

## Features

- **User Management**: Ability to create users with hashed passwords and retrieve user information.
- **Product Management**: Add and retrieve products.
- **Favorites Management**: Users can mark products as favorites and manage these favorites.

## Installation Steps

1. **Clone the Repository**: `git clone <repository-url>`.
2. **Install Dependencies**: Run `npm install` to install the necessary dependencies, including `pg` for PostgreSQL integration and `bcrypt` for password hashing.
3. **Database Setup**: Create a PostgreSQL database named `the_acme_store`.
4. **Environment Configuration**: Ensure the `.env` file is configured with your database connection string, e.g., `DATABASE_URL=postgres://localhost/the_acme_store`.
5. **Initialize Database**: Execute the database schema and optional seeding scripts to prepare your database for the application.

## API Endpoints

### Users

- **GET /api/users**: Retrieves a list of all users.
- **POST /api/users**: Creates a new user with a hashed password.

### Products

- **GET /api/products**: Fetches a list of all products.
- **POST /api/products**: Adds a new product to the store.

### Favorites

- **GET /api/users/:id/favorites**: Lists a user's favorite products.
- **POST /api/users/:id/favorites**: Marks a product as a favorite for the user.
- **DELETE /api/users/:userId/favorites/:id**: Removes a product from a user's favorites.

## Running the Server

- Use `npm start` to run the server. The server will typically run on `localhost:3000`.

## Testing

- Utilize Postman or any similar API testing tool to ensure all endpoints function as expected.

## Database Schema

- **User**
  - `id`: UUID, primary key.
  - `username`: STRING, unique.
  - `password`: STRING, hashed.
  
- **Product**
  - `id`: UUID, primary key.
  - `name`: STRING.
  
- **Favorite**
  - `id`: UUID, primary key.
  - `product_id`: UUID, foreign key referencing the products table.
  - `user_id`: UUID, foreign key referencing the users table.
  - Unique constraint on the combination of `user_id` and `product_id` to prevent duplicate favorites.

## Further Development

Consider implementing additional features such as user authentication, product categories, or user reviews to enhance the functionality of 'The Acme Store'.


