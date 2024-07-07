const express = require("express");
const bpController = require("./controllers/bpController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const validateBlogPost = require("./middlewares/validateBlogPost");

const app = express();
const port = 3000;

const staticMiddleware = express.static("public"); // Path to the public folder

// Include body-parser middleware to handle JSON data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

app.use(staticMiddleware); // Mount the static middleware

// Routes for GET requests
app.get("/blogPosts", bpController.getAllBlogPosts);
app.get("/blogPosts/:id", bpController.getBlogPostById);

// Route for CREATE requests
app.post("/blogPosts", validateBlogPost, bpController.createBlogPost); 

// Route for UPDATE requests
app.put("/blogPosts/:id", validateBlogPost, bpController.updateBlogPost); 

// Route for DELETE requests
app.delete("/blogPosts/:id", bpController.deleteBlogPost);

// Establish db connection and graceful shutdown
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