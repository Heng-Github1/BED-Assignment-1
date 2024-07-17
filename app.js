require('dotenv').config(); // Load environment variables from .env file

const express = require("express");
const bodyParser = require("body-parser");
const sql = require("mssql");
const newsController = require("./controllers/newsController");
const bpController = require("./controllers/bpController");
const userController = require("./controllers/userController");
const validateNews = require("./middlewares/validateNews"); 
const validateBlogPost = require("./middlewares/validateBlogPost");
const auth = require('./middlewares/auth'); // JWT middleware
const dbConfig = require("./dbConfig");

const swaggerUi = require("swagger-ui-express");
const { swaggerUi, swaggerDocs } = require('./swagger'); // Swagger setup

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// News routes
app.get("/newsArticle", newsController.getAllNews);
app.get("/newsArticle/:newsid", newsController.getNewsById);
app.post("/newsArticle", validateNews, newsController.createNews); 
app.delete("/newsArticle/:newsid", newsController.deleteNews); 
app.patch("/newsArticle/:newsid", validateNews, newsController.updateNews);

// Blog Post routes
app.get("/blogPosts", bpController.getAllBlogPosts);
app.get("/blogPosts/:id", bpController.getBlogPostById);
app.post("/blogPosts", validateBlogPost, bpController.createBlogPost); 
app.put("/blogPosts/:id", validateBlogPost, bpController.updateBlogPost); 
app.delete("/blogPosts/:id", bpController.deleteBlogPost);

// User routes
app.post("/register", userController.registerUser); // Register route
app.post("/login", userController.loginUser); // Login route

// Protect routes with JWT middleware
app.get("/users", auth, userController.getAllUsers);
app.get("/users/:userID", auth, userController.getUserById);
app.post("/users", auth, userController.createUser);
app.delete("/users/:userID", auth, userController.deleteUser);
app.patch("/users/:userID", auth, userController.updateUser);

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
