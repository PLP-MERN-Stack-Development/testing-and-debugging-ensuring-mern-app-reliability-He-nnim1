const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require('./models/Post');
const User = require('./models/User');
const { authMiddleware } = require('./utils/auth');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(bodyParser.json());

// Request logger
app.use((req, res, next) => {
  logger.info('%s %s', req.method, req.originalUrl);
  next();
});

// Create post
app.post('/api/posts', authMiddleware, async (req, res, next) => {
  try {
    const { title, content, category } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      category,
      slug: (title || '').toLowerCase().replace(/\s+/g, '-'),
    });

    return res.status(201).json(post);
  } catch (err) {
    return next(err);
  }
});

// Get posts (with optional category filter and pagination)
app.get('/api/posts', async (req, res, next) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const posts = await Post.find(filter).skip(skip).limit(Number(limit)).lean();
    return res.json(posts);
  } catch (err) {
    return next(err);
  }
});

// Get post by id
app.get('/api/posts/:id', async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    const post = await Post.findById(req.params.id).lean();
    if (!post) return res.status(404).json({ error: 'Not found' });
    return res.json(post);
  } catch (err) {
    return next(err);
  }
});

// Update post
app.put('/api/posts/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    const updates = req.body;
    Object.assign(post, updates);
    await post.save();
    return res.json(post);
  } catch (err) {
    return next(err);
  }
});

// Delete post
app.delete('/api/posts/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ error: 'Invalid id' });
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ error: 'Not found' });
    if (post.author.toString() !== req.user.id) return res.status(403).json({ error: 'Forbidden' });

    await Post.findByIdAndDelete(id);
    return res.json({ success: true });
  } catch (err) {
    return next(err);
  }
});

// Global error handler (should be last middleware)
app.use(errorHandler);

module.exports = app;
