const BlogPost = require("../models/blogPost");

const getAllBlogPosts = async (req, res) => {
  try {
    const blogPosts = await BlogPost.getAllBlogPosts();
    res.json(blogPosts);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving blog posts");
  }
};

const getBlogPostById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const blogPost = await BlogPost.getBlogPostById(id);
    if (!blogPost) {
      return res.status(404).send("Blog post not found");
    }
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving blog post");
  }
};

module.exports = {
  getAllBlogPosts,
  getBlogPostById,
};