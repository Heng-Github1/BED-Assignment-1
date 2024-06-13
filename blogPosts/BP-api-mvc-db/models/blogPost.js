const sql = require("mssql");
const dbConfig = require("../dbConfig");

class BlogPost {
  constructor(id, content, authorID) {
    this.id = id;
    this.content = content;
    this.authorID = authorID;
  }

  static async getAllBlogPosts() {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `SELECT bp.id, bp.content, bp.authorID, u.userID, u.username 
      FROM blogPosts bp 
      INNER JOIN users u ON bp.authorID = u.userID`;
  
    const request = connection.request();
    const result = await request.query(sqlQuery);
  
    connection.close();
  
    return result.recordset.map(
      (row) => new BlogPost(
        row.id,
        row.content, // Add content to the constructor
        row.authorID,
        row.userID,
        row.username
      )
    );
  }
  
  static async getBlogPostById(id) {
    const connection = await sql.connect(dbConfig);
  
    const sqlQuery = `SELECT bp.id, bp.content, bp.authorID, u.userID, u.username 
      FROM blogPosts bp 
      INNER JOIN users u ON bp.authorID = u.userID 
      WHERE bp.id = @id`;
  
    const request = connection.request();
    request.input("id", id);
    const result = await request.query(sqlQuery);
  
    connection.close();
  
    return result.recordset[0]
      ? new BlogPost(
          result.recordset[0].id,
          result.recordset[0].content, // Add content to the constructor
          result.recordset[0].authorID,
          result.recordset[0].userID,
          result.recordset[0].username
        )
      : null;
  }
}

module.exports = BlogPost;