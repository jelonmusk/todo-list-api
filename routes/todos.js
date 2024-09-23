const express = require('express');
const auth = require('../middleware/auth');
const Todo = require('../models/todo');
const router = express.Router();

// Create a new todo
router.post('/todos', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = new Todo({
      title,
      description,
      userId: req.user,
    });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/todos/:id', auth, async (req, res) => {
  const { title, description } = req.body;
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo.userId.toString() !== req.user) return res.status(403).json({ message: 'Forbidden' });

    todo.title = title;
    todo.description = description;
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/todos/:id', auth, async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (todo.userId.toString() !== req.user) return res.status(403).json({ message: 'Forbidden' });

    await todo.deleteOne();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todos with pagination
router.get('/todos', auth, async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const todos = await Todo.find({ userId: req.user })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Todo.countDocuments({ userId: req.user });
    res.json({ data: todos, page: parseInt(page), limit: parseInt(limit), total });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
