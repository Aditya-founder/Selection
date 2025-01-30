require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file");
  process.exit(1); // Exit if MongoDB URI is not provided
}

app.use(cors({ origin: "*" })); // Allow requests from all origins
app.use(bodyParser.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit on DB connection failure
  });

// Define Schema & Model
const CardSchema = new mongoose.Schema({
  name: String,
  number: Number,
});
const Card = mongoose.model("Card", CardSchema);

let availableNumbers = Array.from({ length: 29 }, (_, i) => i + 1);

app.post("/assign-card", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "Name is required" });

    if (availableNumbers.length === 0) {
      return res.status(400).json({ error: "All numbers are assigned" });
    }

    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const assignedNumber = availableNumbers.splice(randomIndex, 1)[0];

    const newCard = new Card({ name, number: assignedNumber });
    await newCard.save();

    res.json(newCard);
  } catch (error) {
    console.error("❌ Error in /assign-card:", error);
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/assigned-cards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.json(cards);
  } catch (error) {
    console.error("❌ Error in /assigned-cards:", error);
    res.status(500).json({ error: "Database error" });
  }
});

// Start Server & Listen on 0.0.0.0 for Dev Tunnel Access
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
