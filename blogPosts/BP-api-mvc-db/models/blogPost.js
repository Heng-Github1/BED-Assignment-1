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

    const sqlQuery = `SELECT bp.BPid, bp.content, bp.authorID, bp.bpCreated, bp.bpModified, u.userID, u.username 
      FROM blogPosts bp 
      INNER JOIN users u ON bp.authorID = u.userID 
      WHERE bp.BPid = @BPid`;

    const request = connection.request();
    request.input("BPid", sql.Int, BPid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new BlogPost(
          result.recordset[0].BPid,
          result.recordset[0].content,
          result.recordset[0].authorID,
          result.recordset[0].bpCreated,
          result.recordset[0].bpModified
        )
      : null;
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
    request.input("BPid", newBPData.BPid)
  
    const result = await request.query(sqlQuery);
  
    console.log("Result:", result);
  
    connection.close();
  
    // Retrieve the newly created book using its ID
    console.log("Retrieving newly created blog post...");
    return this.getBlogPostById(result.recordset[0].BPid);
  }
}

module.exports = BlogPost;

