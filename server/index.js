const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectMongo = require("./db/mongo");
const executeRoute = require("./routes/execute");
const assignmentsRoute = require("./routes/assignments");
const hintRoute = require("./routes/hint");
const authRoute = require("./routes/auth");
const attemptsRoute = require("./routes/attempts");

const app = express();

app.use(cors());
app.use(express.json());

connectMongo();

app.get("/", (req, res) => {
  res.json({ message: "CipherSQLStudio server is running" });
});

app.use("/api/execute", executeRoute);
app.use("/api/assignments", assignmentsRoute);
app.use("/api/hint", hintRoute);
app.use("/api/auth", authRoute);
app.use("/api/attempts", attemptsRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});