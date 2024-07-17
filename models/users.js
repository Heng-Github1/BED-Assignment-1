const sql = require("mssql");
const dbConfig = require("../dbConfig");

// User class to represent and manage user data
class User {
  constructor(userID, username, email, password, role, userCreated, userModified) {
    this.userID = userID;
    this.username = username;
    this.email = email;
    this.password = password;
    this.role = role;
    this.userCreated = userCreated;
    this.userModified = userModified;
  }

  //---------------GET ALL USERS------------------
  // Retrieve all users from the database
  static async getAllUsers() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM users`;
    const request = connection.request();
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset.map(
      (row) => new User(row.userID, row.username, row.email, row.password, row.role, row.userCreated, row.userModified)
    );
  }

  //---------------GET A SINGLE USER------------------
  // Retrieve a single user by ID from the database
  static async getUserById(userID) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM users WHERE userID = @userID`;
    const request = connection.request();
    request.input("userID", userID);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new User(
          result.recordset[0].userID,
          result.recordset[0].username,
          result.recordset[0].email,
          result.recordset[0].password,
          result.recordset[0].role,
          result.recordset[0].userCreated,
          result.recordset[0].userModified
        )
      : null;
  }

  //---------------CREATE A USER------------------
  // Create a new user in the database
  async save() {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO users (username, email, password, role, userCreated, userModified) 
                      VALUES (@username, @email, @password, @role, @userCreated, @userModified); 
                      SELECT SCOPE_IDENTITY() AS userID;`;
    const request = connection.request();
    request.input("username", this.username);
    request.input("email", this.email);
    request.input("password", this.password);
    request.input("role", this.role);
    request.input("userCreated", this.userCreated);
    request.input("userModified", this.userModified);
    const result = await request.query(sqlQuery);
    connection.close();
    this.userID = result.recordset[0].userID; // Set the userID after insertion
    return this;
  }

  //---------------UPDATE A USER------------------
  // Update an existing user in the database
  static async updateUser(userID, userData) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `UPDATE users 
                      SET username = @username, email = @email, password = @password, role = @role, userCreated = @userCreated, userModified = @userModified 
                      WHERE userID = @userID`;
    const request = connection.request();
    request.input("userID", userID);
    request.input("username", userData.username || null);
    request.input("email", userData.email || null);
    request.input("password", userData.password || null);
    request.input("role", userData.role || null);
    request.input("userCreated", userData.userCreated || null);
    request.input("userModified", userData.userModified || null);
    await request.query(sqlQuery);
    connection.close();
    return this.getUserById(userID);
  }

  //---------------DELETE A USER------------------
  // Delete a user from the database
  static async deleteUser(userID) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM users WHERE userID = @userID`;
    const request = connection.request();
    request.input("userID", userID);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected > 0;
  }

  //---------------FIND USER BY USERNAME------------------
  // Find a user by their username
  static async findByUsername(username) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `SELECT * FROM users WHERE username = @username`;
    const request = connection.request();
    request.input("username", username);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.recordset[0]
      ? new User(
          result.recordset[0].userID,
          result.recordset[0].username,
          result.recordset[0].email,
          result.recordset[0].password,
          result.recordset[0].role,
          result.recordset[0].userCreated,
          result.recordset[0].userModified
        )
      : null;
  }
}

module.exports = User;
