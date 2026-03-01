const express = require("express");
const router = express.Router();
const Attempt = require("../models/Attempt");
const authMiddleware = require("../middleware/auth");

router.post("/", authMiddleware, async (req, res) => {
  const { assignmentId, query, status, errorMessage, rowCount } = req.body;

  if (!assignmentId || !query || !status) {
    return res.status(400).json({ error: "assignmentId, query and status are required." });
  }
  try {
    const attempt = await Attempt.create({
      userId: req.user.id,
      assignmentId,
      query,
      status,
      errorMessage: errorMessage || null,
      rowCount: rowCount || 0,
    });

    res.status(201).json(attempt);
  } catch (error) {
    res.status(500).json({ error: "Failed to save attempt." });
  }
});

router.get("/:assignmentId", authMiddleware, async (req, res) => {
  try {
    const attempts = await Attempt.find({
      userId: req.user.id,
      assignmentId: req.params.assignmentId,
    }).sort({ createdAt: -1 });

    res.json(attempts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch attempts." });
  }
});

module.exports = router;
