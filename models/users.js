const sql = require("mssql"); // Import the mssql library for database operations
const dbConfig = require("../dbConfig"); // Import the database configuration

/**
 * Class representing a user
 */
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

  /**
   * Get all users from the database
   * @returns {Promise<User[]>} Array of user objects
   */
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

  /**
   * Get a user by ID
   * @param {number} userID - The ID of the user to retrieve
   * @returns {Promise<User|null>} User object or null if not found
   */
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

  /**
   * Create a new user
   * @param {User} userData - The data of the user to create
   * @returns {Promise<User>} The created user object
   * @throws {Error} If the role is invalid
   */
  static async createUser(userData) {
    if (!["Guest", "Admin"].includes(userData.role)) {
      throw new Error("Invalid role. Must be either 'Guest' or 'Admin'.");
    }

    const connection = await sql.connect(dbConfig);
    const sqlQuery = `INSERT INTO users (username, email, password, role, userCreated, userModified) 
                      VALUES (@username, @email, @password, @role, @userCreated, @userModified); 
                      SELECT SCOPE_IDENTITY() AS userID;`;
    const request = connection.request();
    request.input("username", userData.username);
    request.input("email", userData.email);
    request.input("password", userData.password);
    request.input("role", userData.role);
    request.input("userCreated", userData.userCreated);
    request.input("userModified", userData.userModified);
    const result = await request.query(sqlQuery);
    connection.close();
    return this.getUserById(result.recordset[0].userID);
  }

  /**
   * Update a user by ID
   * @param {number} userID - The ID of the user to update
   * @param {Object} userData - The updated user data
   * @returns {Promise<User>} The updated user object
   */
  static async updateUser(userID, userData) {
    const connection = await sql.connect(dbConfig);
    let sqlQuery = 'UPDATE users SET ';
    const request = connection.request();
    request.input("userID", userID);
  
    const updateFields = [];
    if (userData.username) {
      updateFields.push('username = @username');
      request.input("username", userData.username);
    }
    if (userData.email) {
      updateFields.push('email = @email');
      request.input("email", userData.email);
    }
    if (userData.password) {
      updateFields.push('password = @password');
      request.input("password", userData.password);
    }
    if (userData.role) {
      updateFields.push('role = @role');
      request.input("role", userData.role);
    }
    if (userData.userCreated) {
      updateFields.push('userCreated = @userCreated');
      request.input("userCreated", userData.userCreated);
    }
    if (userData.userModified) {
      updateFields.push('userModified = @userModified');
      request.input("userModified", userData.userModified);
    }
  
    sqlQuery += updateFields.join(', ') + ' WHERE userID = @userID';
  
    await request.query(sqlQuery);
    connection.close();
    return this.getUserById(userID);
  }

  /**
   * Delete a user by ID
   * @param {number} userID - The ID of the user to delete
   * @returns {Promise<boolean>} True if the user was deleted, otherwise false
   */
  static async deleteUser(userID) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM users WHERE userID = @userID`;
    const request = connection.request();
    request.input("userID", userID);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected > 0;
  }

  /**
   * Find a user by username
   * @param {string} username - The username to search for
   * @returns {Promise<User|null>} User object or null if not found
   */
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

module.exports = User; // Export the User class for use in other files
