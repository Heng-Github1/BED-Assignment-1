const express = require("express");
const newsController = require("./controllers/newsController");
const sql = require("mssql");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser (FOR POST and PUT)
const validateNews = require("./middlewares/validateNews"); //For validation

const app = express();
const port = 3000; 


// Include body-parser middleware to handle JSON data(FOR POST and PUT)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling

// Routes for GET requests (replace with appropriate routes for update and delete later)
app.get("/newsArticle", newsController.getAllNews);
app.get("/newsArticle/:newsid", newsController.getNewsById);
app.post("/newsArticle", validateNews, newsController.createNews); // POST for creating news (can handle JSON data)
app.put("/newsArticle/:newsid", newsController.updateNews); // PUT for updating news
app.delete("/newsArticle/:newsid", newsController.deleteNews); // DELETE for deleting news
app.put("/newsArticle/:newsid", validateNews, newsController.updateNews);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    // Terminate the application with an error code (optional)
    process.exit(1); // Exit with code 1 indicating an error
  }

  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  // Perform cleanup tasks (e.g., close database connections)
  await sql.close();
  console.log("Database connection closed");
  process.exit(0); // Exit with code 0 indicating successful shutdown
});