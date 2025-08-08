const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    coverImage: {
      type: String,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    comments: [CommentSchema],
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', BlogSchema);

module.exports = Blog;
