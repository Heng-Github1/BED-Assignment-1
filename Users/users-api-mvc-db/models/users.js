const sql = require("mssql");
const dbConfig = require("../dbconfig");

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

  //--------------- CREATE A USER------------------
  static async createUser(userData) {
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

  //--------------- UPDATE A USER------------------
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

  //--------------- DELETE A USER------------------
  static async deleteUser(userID) {
    const connection = await sql.connect(dbConfig);
    const sqlQuery = `DELETE FROM users WHERE userID = @userID`;
    const request = connection.request();
    request.input("userID", userID);
    const result = await request.query(sqlQuery);
    connection.close();
    return result.rowsAffected > 0;
  }
}

module.exports = User;
