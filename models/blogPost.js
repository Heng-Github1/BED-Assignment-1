const sql = require("mssql");
const dbConfig = require("../dbConfig");

class BlogPost {
    constructor(BPid, title, content, authorID, bpCreated, bpModified) {
        this.BPid = BPid;
        this.title = title;
        this.content = content;
        this.authorID = authorID;
        this.bpCreated = bpCreated;
        this.bpModified = bpModified;
      }

  static async getAllBlogPosts() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = 'SELECT * FROM blogPosts';

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new BlogPost(
        row.BPid,
        row.title,
        row.content,
        row.authorID,
        row.bpCreated,
        row.bpModified
      )
    );
  }

  static async getBlogPostById(BPid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM blogPosts WHERE BPid = @BPid`;
    
    const request = connection.request();
    request.input('BPid', sql.Int, BPid);
    
    const result = await request.query(sqlQuery);
    
    connection.close();

    if (result.recordset.length > 0) { 
        return result.recordset.map(record => new BlogPost(
            record.BPid,
            record.title,
            record.content,
            record.authorID,
            record.bpCreated,
            record.bpModified
        ));
      } else {
          return null; // Return null if no blog post found with the given BPid
      }
}

static async createBlogPost(newBPData) {
  console.log("Creating new blog post...");
  const pool = await sql.connect(dbConfig);

  let transaction;
  try {
    transaction = await pool.transaction();

    // Begin the transaction
    await transaction.begin();

    // Validate authorID ("NEW")
    const validateAuthorQuery = "SELECT COUNT(*) AS count FROM users WHERE userID = @authorID";
    const validateRequest = new sql.Request(transaction);
    validateRequest.input("authorID", sql.Int, newBPData.authorID);
    const validationResult = await validateRequest.query(validateAuthorQuery);

    if (validationResult.recordset[0].count === 0) {
      throw new Error("Invalid authorID: No matching user found in the users table.");
    }

    // Define the SQL query with parameters and GETDATE() for bpCreated and bpModified
    const sqlQuery = `
      INSERT INTO blogPosts (title, content, authorID, bpCreated, bpModified)
      VALUES (@title, @content, @authorID, GETDATE(), GETDATE());
      SELECT SCOPE_IDENTITY() AS BPid;
    `;

    // Prepare the request with the transaction
    const request = new sql.Request(transaction);
    request.input("title", sql.NVarChar(sql.MAX), newBPData.title);
    request.input("content", sql.NVarChar(sql.MAX), newBPData.content);
    request.input("authorID", sql.Int, newBPData.authorID);

    // Execute the query and commit the transaction if successful
    const result = await request.query(sqlQuery);
    await transaction.commit();

    console.log("New blog post created:", result.recordset[0]);

    // Retrieve the newly created BP using its ID
    const createdBP = await this.getBlogPostById(result.recordset[0].BPid);
    console.log("Retrieved newly created blog post:", createdBP);

    return createdBP;

  } catch (error) {
    // If any error occurs, rollback the transaction
    if (transaction) {
      await transaction.rollback();
    }
    console.error("Error creating blog post:", error.message);
    throw error;
  } finally {
    // Close the connection pool
    await pool.close();
  }
}



  static async updateBlogPost(BPid, newBPData) {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `UPDATE blogPosts SET title = @title, content = @content, authorID = @authorID, bpModified = GETDATE() WHERE BPid = @BPid`;; // Parameterized query
  
    const request = connection.request();
    request.input("BPid", BPid);
    request.input("title", newBPData.title || null);
    request.input("content", newBPData.content || null);
    request.input("authorID", newBPData.authorID || null);
  
    await request.query(sqlQuery);
  
    connection.close();

    return this.getBlogPostById(BPid); // returning the updated BP data
  }

  static async deleteBlogPost(BPid) {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `DELETE FROM blogPosts WHERE BPid = @BPid`; // Parameterized query
  
    const request = connection.request();
    request.input("BPid", BPid);
    const result = await request.query(sqlQuery);
  
    connection.close();
  
    if (result.rowsAffected === 0) {
      console.error(`Blog post with ID ${BPid} not found`);
    }
  
    return result.rowsAffected > 0;
  }

}

module.exports = BlogPost;