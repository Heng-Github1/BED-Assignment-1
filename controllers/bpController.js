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
  const BPid = parseInt(req.params.id);
  try {
    const blogPost = await BlogPost.getBlogPostById(BPid);
    if (!blogPost) {
      return res.status(404).send("Blog post not found");
    }
    res.json(blogPost);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving blog post");
  }
};

const createBlogPost = async (req, res) => {
    const newBlogPost = req.body;
    try {
      const createdBlogPost = await BlogPost.createBlogPost(newBlogPost);
      res.status(201).json(createdBlogPost);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error creating blog post");
    }
};

const updateBlogPost = async (req, res) => {
    const BPid = parseInt(req.params.id);
    const newBPData = req.body;
  
    try {
      const updatedBlogPost = await BlogPost.updateBlogPost(BPid, newBPData); 
      if (!updatedBlogPost) {
        return res.status(404).send("Blog post not found");
      }
      res.json(updatedBlogPost);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error updating blog post");
    }
}

const deleteBlogPost = async (req, res) => {
        const BPid = parseInt(req.params.id);
      
        try {
            const success = await BlogPost.deleteBlogPost(BPid);
            if (!success) {
              return res.status(404).send("Blog post not found");
            }
            res.status(204).send();
          } catch (error) {
            console.error(error);
            res.status(500).send("Error deleting blog post");
          }
};


const searchBlogPosts = async (req, res) => {
  const searchTerm = req.query.searchTerm;
  const blogPosts = await BlogPost.searchBlogPosts(searchTerm);
  res.json(blogPosts);
};


module.exports = {
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  searchBlogPosts
};
