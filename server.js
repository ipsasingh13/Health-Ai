const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/nutritrack')
  .then(() => console.log('MongoDB Connected Successfully'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Simple Schema for Health Metrics
const healthMetricSchema = new mongoose.Schema({
  weight: Number,
  height: Number,
  bmi: Number,
  calories: Number,
  date: { type: Date, default: Date.now }
});

const Metric = mongoose.model('Metric', healthMetricSchema);

// API Routes
app.get('/api/metrics', async (req, res) => {
  try {
    const metrics = await Metric.find().sort({ date: -1 });
    res.json(metrics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/api/metrics', async (req, res) => {
  const { weight, height, calories } = req.body;
  
  // Simple BMI Calculation: weight (kg) / [height (m)]²
  const heightInMeters = height / 100;
  const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

  const newMetric = new Metric({
    weight,
    height,
    bmi,
    calories
  });

  try {
    const savedMetric = await newMetric.save();
    res.status(201).json(savedMetric);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});