const express = require("express");
const app = express();
const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "reservation_planner",
  password: "Password",
  port: 5432,
});

app.use(express.json());

const createTables = async () => {
  const query = `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS users;
    
    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    );

    CREATE TABLE reservation (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      createdAt TIMESTAMP DEFAULT now() NOT NULL,
      completedAt TIMESTAMP DEFAULT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      complete BOOLEAN DEFAULT FALSE,
      assignedUser UUID REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  await client.query(query);
};

// Create a new user
const createCustomer = async (name, email, password) => {
  const result = await client.query(
    "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
};

// Create a new reservation
const createReservation = async (title, description, assignedUser) => {
  const result = await client.query(
    "INSERT INTO reservation (title, description, assignedUser) VALUES ($1, $2, $3) RETURNING *",
    [title, description, assignedUser]
  );
  return result.rows[0];
};

// API Endpoints

// Home Route
app.get("/", (req, res) => {
  res.send("test");
});

// Create a new user (POST /users)
app.post("/users", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await createCustomer(name, email, password);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all users (GET /users)
app.get("/users", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a reservation (POST /reservations)
app.post("/reservations", async (req, res) => {
  try {
    const { title, description, assignedUser } = req.body;
    const reservation = await createReservation(
      title,
      description,
      assignedUser
    );
    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all reservations (GET /reservations)
app.get("/reservations", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM reservation");
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export modules
module.exports = {
  createTables,
  createCustomer,
  createReservation,
  client,
  app,
};
