const express = require("express");
require("dotenv").config();

const connectDB = require("./src/config/db");
const authRoutes = require("./src/routes/authRoutes");

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Hostel Management System API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});