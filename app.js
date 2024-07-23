const express = require("express");
const newsController = require("./controllers/newsController");
const bpController = require("./controllers/bpController");
const userController = require("./controllers/userController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); 
const validateNews = require("./middlewares/validateNews"); 
const validateBlogPost = require("./middlewares/validateBlogPost");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

const app = express();
const port = 3000; 

const staticMiddleware = express.static("public"); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(staticMiddleware); 

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
app.get("/users", userController.getAllUsers);
app.post("/users",userController.loginUser)

//Swagger route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

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