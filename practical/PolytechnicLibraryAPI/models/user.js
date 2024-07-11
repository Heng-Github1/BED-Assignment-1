const sql = require("mssql");
const bcrypt = require("bcryptjs");
const dbConfig = require("../dbConfig");

class User {
  constructor(username, password, role) {
    this.username = username;
    this.password = password;
    this.role = role;
  }

  async save() {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
                INSERT INTO Users (username, passwordHash, role)
                VALUES (@username, @passwordHash, @role);
                SELECT SCOPE_IDENTITY() AS user_id;
            `;

      const request = connection.request();
      request.input("username", this.username);
      request.input("passwordHash", this.password);
      request.input("role", this.role || null);

      const result = await request.query(sqlQuery);

      connection.close();

      // Update instance with new user_id
      this.user_id = result.recordset[0].user_id;

      return this;
    } catch (error) {
      throw error;
    }
  }

  static async getAllUsers() {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `SELECT * FROM Users`;

      const request = connection.request();
      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset.map(row => new User(row.user_id, row.username, row.passwordHash, row.role));
    } catch (error) {
      throw error;
    }
  }

  static async getUserByUsername(username) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `SELECT * FROM Users WHERE username = @username`;

      const request = connection.request();
      request.input("username", username);
      const result = await request.query(sqlQuery);

      connection.close();

      return result.recordset[0]
        ? new User(result.recordset[0].username, result.recordset[0].passwordHash, result.recordset[0].role)
        : null;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(user_id, newUserData) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `
                UPDATE Users
                SET username = @username,
                    passwordHash = @passwordHash,
                    role = @role
                WHERE user_id = @user_id
            `;

      const request = connection.request();
      request.input("user_id", user_id);
      request.input("username", newUserData.username || null);
      request.input("passwordHash", newUserData.passwordHash || null);
      request.input("role", newUserData.role || null);

      await request.query(sqlQuery);

      connection.close();

      return await this.getUserById(user_id); // Returning the updated user data
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(user_id) {
    try {
      const connection = await sql.connect(dbConfig);

      const sqlQuery = `DELETE FROM Users WHERE user_id = @user_id`;

      const request = connection.request();
      request.input("user_id", user_id);
      const result = await request.query(sqlQuery);

      connection.close();

      return result.rowsAffected > 0;
    } catch (error) {
      throw error;
    }
  }

  static async searchUsers(searchTerm) {
    try {
      const connection = await sql.connect(dbConfig);

      const query = `
                SELECT *
                FROM Users
                WHERE username LIKE '%${searchTerm}%'
                OR email LIKE '%${searchTerm}%'
            `;

      const result = await connection.request().query(query);
      connection.close();

      return result.recordset;
    } catch (error) {
      throw new Error("Error searching users");
    }
  }
}



module.exports = User;