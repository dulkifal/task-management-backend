const express = require('express');
const { body, validationResult } = require('express-validator');

const Task = require('../models/Task');
const auth = require('../middleware/auth');
const router = express.Router();

// Create Task
router.post(
    '/',
    auth,
    [
      body('title').notEmpty().withMessage('Title is required'),
      body('dueDate').isDate().withMessage('Invalid due date'),
      body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
    ],
    async (req, res) => {
      try {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }
    
        const task = new Task({ ...req.body, userId: req.user.userId });
        await task.save();
        res.status(201).json(task);
      }
      catch (err) {
        res.status(500).json({ message: err.message });
      }
    }
  );
  

// Fetch all tasks (Admin sees all, Regular users see their own)
router.get('/', auth, async (req, res) => {
  try {
    const tasks = req.user.role === 'admin'
      ? await Task.find().populate('userId', 'username') // Include user details
      : await Task.find({ userId: req.user.userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// get Task by id
router.get('/:id', auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});
// Update Task
router.put('/:id', auth, async (req, res) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(task);
});

// Delete Task
router.delete('/:id', auth, async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;