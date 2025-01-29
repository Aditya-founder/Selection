require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Define Schema & Model
const CardSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Card = mongoose.model("Card", CardSchema);

let availableNumbers = Array.from({ length: 29 }, (_, i) => i + 1);

app.post("/assign-card", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  if (availableNumbers.length === 0) {
    return res.status(400).json({ error: "All numbers are assigned" });
  }

  const randomIndex = Math.floor(Math.random() * availableNumbers.length);
  const assignedNumber = availableNumbers.splice(randomIndex, 1)[0];

  try {
    const newCard = new Card({ name, number: assignedNumber });
    await newCard.save();
    res.json(newCard);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/assigned-cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
