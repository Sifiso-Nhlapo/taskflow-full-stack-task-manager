
const express = require('express');

const { protect } = require('../middleware/authMiddleware');

const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} = require('../controllers/taskController');

const router = express.Router();
//router.use(protect)----this line applies the authentication middleware to every route in this router.

// All routes below require a valid JWT.
router.use(protect);

// GET /api/tasks — Get the logged-in user's tasks.
router.get('/', getTasks);

// POST /api/tasks — Create a task.
router.post('/', createTask);

// GET /api/tasks/:id — Get one task.
router.get('/:id', getTask);

// PATCH /api/tasks/:id — Update a task.
router.patch('/:id', updateTask);

// DELETE /api/tasks/:id — Delete a task.
router.delete('/:id', deleteTask);

module.exports = router;
