const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Connect MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/ddd")
  .then(() => console.log("MongoDB Connected ✅"))
  .catch(err => console.log(err));

// Schema
const ActivitySchema = new mongoose.Schema({
  userId: String,
  type: String,
  points: Number,
  timestamp: { type: Date, default: Date.now }
});

const Activity = mongoose.model("Activity", ActivitySchema);

// Points system
const pointsMap = {
  video: 10,
  quiz: 20,
  review: 15
};

// Track activity
app.post("/track", async (req, res) => {
  const { userId, type } = req.body;

  const activity = new Activity({
    userId,
    type,
    points: pointsMap[type] || 5
  });

  await activity.save();

  res.json({ message: "Activity saved to MongoDB" });
});

// Get stats
app.get("/stats/:userId", async (req, res) => {
  const activities = await Activity.find({
    userId: req.params.userId
  });

  const totalPoints = activities.reduce(
    (sum, a) => sum + a.points,
    0
  );

  res.json({
    totalActivities: activities.length,
    totalPoints,
    activities
  });
});

// Reset database
app.post("/reset", async (req, res) => {
  await Activity.deleteMany({});
  res.json({ message: "All data cleared" });
});

// Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});
