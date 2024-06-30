const sql = require("mssql");
const dbConfig = require("../dbConfig");

class BlogPost {
    constructor(BPid, content, authorID, bpCreated, bpModified) {
        this.BPid = BPid;
        this.content = content;
        this.authorID = authorID;
        this.bpCreated = bpCreated;
        this.bpModified = bpModified;
      }

  static async getAllBlogPosts() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT bp.BPid, bp.content, bp.authorID, bp.bpCreated, bp.bpModified, u.userID, u.username 
      FROM blogPosts bp 
      INNER JOIN users u ON bp.authorID = u.userID`;

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new BlogPost(
        row.BPid,
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
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `INSERT INTO BlogPosts (content, authorID, BPid, bpCreated, bpModified)
    VALUES (@content, @authorID, @BPid, GETDATE(), GETDATE());
    SELECT SCOPE_IDENTITY() AS BPid;`;
  
    const request = connection.request();
    request.input("content", newBPData.content);
    request.input("authorID", newBPData.authorID);
  
    const result = await request.query(sqlQuery);
  
    console.log("Result:", result);
  
    connection.close();
  
    // Retrieve the newly created BP using its ID
    console.log("Retrieving newly created blog post...");
    return this.getBlogPostById(result.recordset[0].BPid);
  }

  static async updateBlogPost(BPid, newBPData) {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `UPDATE blogPosts SET content = @content, authorID = @authorID, bpModified = GETDATE() WHERE BPid = @BPid`;; // Parameterized query
  
    const request = connection.request();
    request.input("BPid", BPid);
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

