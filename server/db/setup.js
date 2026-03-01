require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DIRECT_URL,
  ssl: { rejectUnauthorized: false },
});

async function setup() {
  const client = await pool.connect();
  try {
    console.log("Connected to Supabase PostgreSQL");

    await client.query(`
      DROP TABLE IF EXISTS orders CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS products CASCADE;
    `);
    console.log("Dropped existing tables");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE orders (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        amount NUMERIC(10, 2) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL
      );
    `);
    console.log("Created tables");

    await client.query(`
      INSERT INTO users (name, age) VALUES
        ('Alice', 25),
        ('Bob', 17),
        ('Charlie', 30),
        ('Diana', 22),
        ('Eve', 15),
        ('Frank', 35),
        ('Grace', 28),
        ('Hank', 19);
    `);
    console.log("Seeded users");

    await client.query(`
      INSERT INTO orders (user_id, amount) VALUES
        (1, 150.00),
        (1, 200.50),
        (1, 75.00),
        (2, 300.00),
        (3, 120.00),
        (3, 450.75),
        (4, 90.00),
        (6, 500.00),
        (6, 250.00),
        (7, 180.00);
    `);
    console.log("Seeded orders");

    await client.query(`
      INSERT INTO products (name, price) VALUES
        ('Laptop', 999.99),
        ('Mouse', 25.00),
        ('Keyboard', 75.50),
        ('Monitor', 399.00),
        ('Headphones', 149.99),
        ('Webcam', 89.99),
        ('USB Hub', 35.00),
        ('Desk Lamp', 45.00);
    `);
    console.log("Seeded products");

    console.log("Done.");
  } catch (error) {
    console.error("Setup error:", error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setup();
