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
const swaggerDocument = require("./swagger/swagger-output.json"); // Import generated spec

const app = express();
const port = process.env.PORT || 3000; // Use environment variable or default port

const staticMiddleware = express.static("public");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticMiddleware);

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
// Route for user registration
app.post("/register", userController.registerUser); // This route handles the registration of a new user by calling the 'registerUser' function in the userController.

// Route for user login
app.post("/login", userController.loginUser); // This route handles the login of a user by calling the 'loginUser' function in the userController.

// Route for resetting the user's password
app.patch("/users/reset-password", userController.resetPassword); // This route allows a user to reset their password by calling the 'resetPassword' function in the userController.

// Protect routes with JWT middleware
app.get("/users/profile", auth, userController.getUserProfile); // User profile route
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
