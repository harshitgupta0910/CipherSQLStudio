const express = require("express");
const router = express.Router();
const pool = require("../db/postgres");

router.post("/", async (req, res) => {
  const { query } = req.body;
  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "A query string is required." });
  }
  if (!query.trim().toLowerCase().startsWith("select")) {
    return res.status(400).json({ error: "Only SELECT queries are allowed." });
  }
  try {
    const result = await pool.query(query);
    res.json({ rows: result.rows });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
module.exports = router;
