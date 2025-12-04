const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Bug = require('./models/bug');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

// Create bug
app.post('/api/bugs', async (req, res, next) => {
  try {
    const { title, description, status = 'open' } = req.body;
    const bug = await Bug.create({ title, description, status });
    res.status(201).json(bug);
  } catch (err) {
    next(err);
  }
});

// Read all bugs
app.get('/api/bugs', async (req, res, next) => {
  try {
    const bugs = await Bug.find().lean();
    res.json(bugs);
  } catch (err) {
    next(err);
  }
});

const mongoose = require('mongoose');

// Update bug
app.put('/api/bugs/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const updates = req.body;
    const bug = await Bug.findByIdAndUpdate(id, updates, { new: true });
    if (!bug) return res.status(404).json({ error: 'Not found' });
    res.json(bug);
  } catch (err) {
    next(err);
  }
});

// Delete bug
app.delete('/api/bugs/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const bug = await Bug.findByIdAndDelete(id);
    if (!bug) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// Error handler
app.use(errorHandler);

module.exports = app;
