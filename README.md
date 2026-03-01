# CipherSQLStudio

A web app where students can practice SQL by writing real queries against a PostgreSQL database. Built as a college project.

The idea is simple — you see a list of assignments, open one, write a SQL query in the editor, run it and see the results. If you're stuck you can ask for a hint and it uses an AI to give you a nudge without spoiling the answer.

---

## What's inside

- **server/** — Node.js + Express backend
- **client/** — React frontend (Vite)

---

## Tech used and why

**Backend**

- Express — straightforward to set up, good for small REST APIs
- pg (node-postgres) — connects to PostgreSQL, used Pool so connections are reused
- Mongoose + MongoDB Atlas — assignments and user attempts are stored here, MongoDB works well for this kind of flexible data
- bcryptjs — hashing passwords before saving to DB
- jsonwebtoken — for login sessions, stores a token in the browser's localStorage
- dotenv — keeps credentials out of the code
- axios — for calling the OpenRouter API to get hints

**Frontend**

- React (Vite) — fast setup, good dev experience
- react-router-dom — for navigation between the assignment list and individual assignment pages
- @monaco-editor/react — the same editor VS Code uses, gives proper SQL syntax highlighting
- axios — API calls from the frontend
- SCSS — used partials and BEM naming, easier to manage than plain CSS

---

## Prerequisites

Make sure you have these installed before starting:

- Node.js (v18 or above)
- PostgreSQL (running locally or a cloud instance)
- A MongoDB Atlas account (free tier works fine)
- An OpenRouter API key (for the hint feature)

---

## Installation

Clone the repo first.

```
git clone <your-repo-url>
cd ciphersqlstudio
```

**Install server dependencies**

```
cd server
npm install
```

**Install client dependencies**

```
cd ../client
npm install
```

---

## Environment variables

Inside the `server` folder, create a `.env` file. You can copy `.env.example` as a starting point.

```
PORT=5000
PG_HOST=localhost
PG_USER=postgres
PG_PASSWORD=your_postgres_password
PG_DATABASE=cipher_sandbox
PG_PORT=5432
MONGODB_URI=your_mongodb_connection_string
OPENROUTER_API_KEY=your_openrouter_key
JWT_SECRET=pick_any_random_string_here
```

`JWT_SECRET` can be anything — just make it long enough that it's not easy to guess. Something like `mysecretkey123` works fine for development.

---

## Setting up PostgreSQL

You need a database called `cipher_sandbox` (or whatever you put in `PG_DATABASE`). The assignments reference three tables — create them in pgAdmin or psql:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name TEXT,
  age INT
);

CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INT,
  amount NUMERIC
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT,
  price NUMERIC
);
```

Add some rows so queries actually return results:

```sql
INSERT INTO users VALUES (1, 'Alice', 22), (2, 'Bob', 17), (3, 'Carol', 30);
INSERT INTO orders VALUES (1, 1, 150.00), (2, 1, 200.00), (3, 2, 50.00);
INSERT INTO products VALUES (1, 'Laptop', 999.99), (2, 'Mouse', 29.99), (3, 'Keyboard', 59.99);
```

---

## Seeding assignments

The assignment questions are stored in MongoDB. Run the seed script once to populate them:

```
cd server
node seed.js
```

This adds 12 assignments (4 easy, 4 medium, 4 hard). Running it again will clear and re-insert them.

---

## Running the project

You need two terminals open — one for the server, one for the client.

**Terminal 1 — server**

```
cd server
npm run dev
```

Server runs on `http://localhost:5000`

**Terminal 2 — client**

```
cd client
npm run dev
```

Client runs on `http://localhost:5173`

Open `http://localhost:5173` in your browser. Sign up for an account and you should see the assignment list.

---

## API routes

```
GET    /                          health check
POST   /api/auth/register         create account
POST   /api/auth/login            login
GET    /api/assignments           get all assignments
GET    /api/assignments/:id       get one assignment
POST   /api/execute               run a SQL query (SELECT only)
POST   /api/hint                  get an AI hint
POST   /api/attempts              save a query attempt (auth required)
GET    /api/attempts/:id          get attempts for an assignment (auth required)
```

---

## Notes

- Only SELECT queries are allowed in `/api/execute`. Any other query type returns a 400 error.
- The hint feature calls OpenRouter which costs API credits. If you're testing locally and don't want to use credits, you can temporarily return a hardcoded string from `routes/hint.js`.
- Passwords are hashed with bcrypt before being stored — plain text passwords are never saved.
