const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });

    const task = await Task.create({
      owner: req.user.userId,
      title,
      description: description || '',
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    res.status(201).json({ task });
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    res.json({ tasks });
  } catch (err) {
    console.error('Get tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) {
    console.error('Get task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const updates = (({ title, description, completed, dueDate }) => ({ title, description, completed, dueDate }))(req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.userId },
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.json({ task });
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user.userId });
    if (!task) return res.status(404).json({ message: 'Task not found or not authorized' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteAll = async (req, res) => {
  try {
    await Task.deleteMany({ owner: req.user.userId });
    res.json({ message: 'All tasks deleted' });
  } catch (err) {
    console.error('Delete all tasks error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
