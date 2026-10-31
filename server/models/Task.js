
const mongoose = require('mongoose');
//title	The task's name, such as “Finish assignment”.
//description	Optional extra details about the task.
//dueDate	The deadline for completing the task.
//priority	How important the task is: low, medium, or high.
//status	Whether the task is pending or completed.
//owner	The user who owns the task.
//timestamps	Automatically tracks creation and update times.
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: 1,
      maxlength: 120,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: '',
    },

    dueDate: {
      type: Date,
      default: null,
    },

    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },

    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
//owner: Each task stores the MongoDB ID of its owner. 
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
