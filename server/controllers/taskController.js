
const mongoose = require('mongoose');
const Task = require('../models/Task');

// CREATE: POST /api/tasks
// Create a task for the authenticated user.
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Task title is required.',
      });
    }

    if (title.trim().length > 120) {
      return res.status(400).json({
        success: false,
        message: 'Task title cannot exceed 120 characters.',
      });
    }

    if (
      description !== undefined &&
      (typeof description !== 'string' || description.length > 2000)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Description must be text and cannot exceed 2000 characters.',
      });
    }

    if (
      dueDate !== undefined &&
      dueDate !== null &&
      dueDate !== ''
    ) {
      if (
        typeof dueDate !== 'string' ||
        !Number.isFinite(Date.parse(dueDate))
      ) {
        return res.status(400).json({
          success: false,
          message: 'Please provide a valid due date.',
        });
      }
    }

    if (
      priority !== undefined &&
      !['low', 'medium', 'high'].includes(priority)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Priority must be low, medium, or high.',
      });
    }

    if (
      status !== undefined &&
      !['pending', 'completed'].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Status must be pending or completed.',
      });
    }

    const task = await Task.create({
      title: title.trim(),
      description: description?.trim() || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      status: status || 'pending',

      // Ownership comes from the verified JWT, not the request body.
      owner: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully.',
      task,
    });
  } catch (error) {
    console.error('Create task error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to create task.',
    });
  }
};

// READ ALL: GET /api/tasks
// Return only the authenticated user's tasks.
const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      owner: req.user.id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.error('Get tasks error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve tasks.',
    });
  }
};

// READ ONE: GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID.',
      });
    }

    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    console.error('Get task error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to retrieve task.',
    });
  }
};

// UPDATE: PATCH /api/tasks/:id
const updateTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID.',
      });
    }

    const allowedFields = [
      'title',
      'description',
      'dueDate',
      'priority',
      'status',
    ];

    const updates = {};
    const suppliedFields = Object.keys(req.body);

    if (
      suppliedFields.length === 0 ||
      suppliedFields.some((field) => !allowedFields.includes(field))
    ) {
      return res.status(400).json({
        success: false,
        message: 'Provide valid task fields to update.',
      });
    }

    for (const field of suppliedFields) {
      const value = req.body[field];

      if (field === 'title') {
        if (typeof value !== 'string' || !value.trim() || value.trim().length > 120) {
          return res.status(400).json({
            success: false,
            message: 'Title must contain 1 to 120 characters.',
          });
        }

        updates.title = value.trim();
      }

      if (field === 'description') {
        if (typeof value !== 'string' || value.length > 2000) {
          return res.status(400).json({
            success: false,
            message: 'Description must be text and cannot exceed 2000 characters.',
          });
        }

        updates.description = value.trim();
      }

      if (field === 'dueDate') {
        if (value === null || value === '') {
          updates.dueDate = null;
        } else if (
          typeof value === 'string' &&
          Number.isFinite(Date.parse(value))
        ) {
          updates.dueDate = value;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Please provide a valid due date or null.',
          });
        }
      }

      if (field === 'priority') {
        if (!['low', 'medium', 'high'].includes(value)) {
          return res.status(400).json({
            success: false,
            message: 'Priority must be low, medium, or high.',
          });
        }

        updates.priority = value;
      }

      if (field === 'status') {
        if (!['pending', 'completed'].includes(value)) {
          return res.status(400).json({
            success: false,
            message: 'Status must be pending or completed.',
          });
        }

        updates.status = value;
      }
    }

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user.id,
      },
      { $set: updates },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully.',
      task,
    });
  } catch (error) {
    console.error('Update task error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to update task.',
    });
  }
};

// DELETE: DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid task ID.',
      });
    }

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully.',
    });
  } catch (error) {
    console.error('Delete task error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Unable to delete task.',
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
};
/*{
  _id: req.params.id,
  owner: req.user.id,
}
 We use it when retrieving, updating, and deleting an individual task. 
 This means the API looks for a task that matches both the task ID and the authenticated user's ID*/