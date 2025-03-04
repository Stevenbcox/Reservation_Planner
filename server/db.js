const express = require("express");
const app = express();
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_reservation_planner');

// const client = new pg.Client({
//   user: "postgres",
//   host: "localhost",
//   database: "reservation planner",
//   password: "Password",
//   port: 5432,
// });

const createTables = async () => {
    const query = `
      DROP TABLE IF EXISTS reservation;
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        password TEXT NOT NULL
      );
      CREATE TABLE reservation (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        createdAt TIMESTAMP DEFAULT now() NOT NULL,
        completedAt TIMESTAMP DEFAULT NULL,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        complete BOOLEAN DEFAULT FALSE,
        assignedUser UUID REFERENCES users(id)
      );
    `;
    await client.query(query);
  };

const createCustomer = async (name, email, password) => {
    const result = await client.query(
        "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
        [name, email, password]
    );
    return result.rows[0];
};

const createRestaurant = async (title, description, assignedUser) => {
    const result = await client.query(
        "INSERT INTO reservation (title, description, assignedUser) VALUES ($1, $2, $3) RETURNING *",
        [title, description, assignedUser]
    );
    return result.rows[0];
};

module.exports = {
    createTables,
    createCustomer,
    createRestaurant,
    client,
};