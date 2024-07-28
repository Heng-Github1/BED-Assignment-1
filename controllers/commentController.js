const Comment = require("../models/comment");

const getCommentsByBPid = async (req, res) => {
  const BPid = parseInt(req.params.id);
  try {
    const comments = await Comment.getCommentsByBPid(BPid);
    res.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).send('Error fetching comments');
  }
};

const createComment = async (req, res) => {
  const newCommentData = req.body;
  try {
    const newComment = await Comment.createComment(newCommentData);
    res.status(201).json(newComment);
  } catch (error) {
    console.error("Error creating comment:", error);
    res.status(500).send("Error creating comment");
  }
};

module.exports = {
  getCommentsByBPid,
  createComment,
};