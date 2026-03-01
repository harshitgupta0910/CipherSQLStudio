const express = require("express");
const router = express.Router();
const Assignment = require("../models/Assignment");

router.get("/", async(req, res) => {
  try {
    const assignments = await Assignment.find();
    res.json(assignments);
  } catch (error) {res.status(500).json({ error: "Failed to fetch assignments."});
  }
});

router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found." });
    }

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch assignment."});
  }
});

module.exports = router;
