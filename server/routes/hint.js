const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { question, userQuery } = req.body;
  if (!question || !userQuery) {
    return res.status(400).json({ error: "question and userQuery are required." });
  }

  const prompt = `You are a SQL tutor helping a student learn SQL.
The student is working on this question: "${question}"
their current SQL query is: "${userQuery}"
Give them a short hint to help them improve their query.
Do not give the full solution or the complete correct query.
Just a small idea in the right direction one or two sentences maximum.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );
    const hint = response.data.choices[0].message.content;
    res.json({ hint});
  } catch (error) {
    res.status(500).json({ error: "Failed to get hint from AI." });
  }
});

module.exports = router;
