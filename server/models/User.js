
const mongoose = require('mongoose');
//required prevents essential fields from being omitted.
//trim removes unnecessary spaces.
//lowercase normalizes email addresses.
//unique creates a database uniqueness constraint for emails; we'll still handle duplicate-email errors in the API.
//select: false excludes passwords from normal Mongoose queries by default.
//timestamps: true automatically records when a user was created and last updated.
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);
