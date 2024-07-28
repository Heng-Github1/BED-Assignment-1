const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Comment {
  constructor(commentID, BPid, authorID, commentContent, commentCreated) {
    this.commentID = commentID;
    this.BPid = BPid;
    this.authorID = authorID;
    this.commentContent = commentContent;
    this.commentCreated = commentCreated;
  }

  static async getCommentsByBPid(BPid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM comments WHERE BPid = @BPid`;
    
    const request = connection.request();
    request.input('BPid', sql.Int, BPid);
    
    const result = await request.query(sqlQuery);
    
    connection.close();

    if (result.recordset.length > 0) { 
        return result.recordset.map(record => new Comment(
            record.commentID,
            record.BPid,
            record.authorID,
            record.commentContent,
            record.commentCreated
        ));
      } else {
          return null;
      }
  }

  static async createComment(newCommentData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `
      INSERT INTO comments (BPid, authorID, commentContent, commentCreated)
      VALUES (@BPid, @authorID, @commentContent, GETDATE());
      SELECT SCOPE_IDENTITY() AS commentID;
    `;

    const request = connection.request();
    request.input("BPid", sql.Int, newCommentData.BPid);
    request.input("authorID", sql.Int, newCommentData.authorID);
    request.input("commentContent", sql.NVarChar(sql.MAX), newCommentData.commentContent);

    const result = await request.query(sqlQuery);
    connection.close();

    return new Comment(
      result.recordset[0].commentID,
      newCommentData.BPid,
      newCommentData.authorID,
      newCommentData.commentContent,
      new Date()
    );
  }
}

module.exports = Comment;