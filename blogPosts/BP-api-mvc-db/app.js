const express = require("express");
const blogPostsController = require("./controllers/blogPostsController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000;

// Routes for GET requests
app.get("/blogPosts", blogPostsController.getAllBlogPosts);
app.get("/blogPosts/:id", blogPostsController.getBlogPostById);

app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});

process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connection closed");
  process.exit(0);
});