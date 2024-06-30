const express = require("express");
const userController = require("./controllers/userController");
const sql = require("mssql");
const dbConfig = require("./dbconfig");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", userController.getAllUsers);
app.get("/users/:userID", userController.getUserById);
app.post("/users", userController.createUser);
app.delete("/users/:userID", userController.deleteUser);
app.patch("/users/:userID", userController.updateUser);

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
