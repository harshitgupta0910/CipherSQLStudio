require("dotenv").config();
const mongoose = require("mongoose");
const Assignment = require("./models/Assignment");

const sampleAssignments = [
  {
    title: "Select All Users",
    description:
      "Write a query to fetch all rows from the 'users' table. This is the most basic SQL query - it retrieves every column and every row.",
    difficulty: "Easy",
    relatedTables: ["users"],
  },
  {
    title: "Select Specific Columns",
    description:
      "Write a query to fetch only the 'name' and 'age' columns from the 'users' table. Avoid using SELECT * - list the columns explicitly.",
    difficulty: "Easy",
    relatedTables: ["users"],
  },
  {
    title: "Filter by Column",
    description:
      "Write a query to fetch only the users whose age is greater than 18 from the 'users' table. Use a WHERE clause to filter rows.",
    difficulty: "Easy",
    relatedTables: ["users"],
  },
  {
    title: "Count Rows",
    description:
      "Write a query to count the total number of rows in the 'orders' table. Use an aggregate function to return a single number.",
    difficulty: "Easy",
    relatedTables: ["orders"],
  },
  {
    title: "Sort Results",
    description:
      "Write a query to fetch all products from the 'products' table sorted by price in descending order (most expensive first).",
    difficulty: "Medium",
    relatedTables: ["products"],
  },
  {
    title: "Aggregate with MIN and MAX",
    description:
      "Write a query to find the cheapest and most expensive product prices from the 'products' table. Return both values in a single query using MIN and MAX.",
    difficulty: "Medium",
    relatedTables: ["products"],
  },
  {
    title: "Join Two Tables",
    description:
      "Write a query to fetch each order along with the name of the user who placed it. Join the 'orders' table with the 'users' table using the user_id column.",
    difficulty: "Medium",
    relatedTables: ["orders", "users"],
  },
  {
    title: "Left Join - Include All Users",
    description:
      "Write a query to fetch all users and their orders. Include users who have not placed any orders (their order columns should show NULL). Use a LEFT JOIN.",
    difficulty: "Medium",
    relatedTables: ["users", "orders"],
  },
  {
    title: "Group and Aggregate",
    description:
      "Write a query to find the total amount spent by each user. Group the 'orders' table by user_id and sum the 'amount' column.",
    difficulty: "Hard",
    relatedTables: ["orders"],
  },
  {
    title: "Group By with HAVING",
    description:
      "Write a query to find all users who have placed more than 2 orders. Group by user_id, count the orders, and use HAVING to filter groups.",
    difficulty: "Hard",
    relatedTables: ["orders"],
  },
  {
    title: "Subquery in WHERE",
    description:
      "Write a query to fetch all users whose age is above the average age of all users. Use a subquery inside the WHERE clause to compute the average.",
    difficulty: "Hard",
    relatedTables: ["users"],
  },
  {
    title: "Find Users with No Orders",
    description:
      "Write a query to find all users who have never placed an order. Use a LEFT JOIN on 'users' and 'orders', then filter for rows where the order id IS NULL.",
    difficulty: "Hard",
    relatedTables: ["users", "orders"],
  },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    await Assignment.deleteMany({});
    await Assignment.insertMany(sampleAssignments);
    console.log(`Inserted ${sampleAssignments.length} assignments`);

    mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
}

seed();

