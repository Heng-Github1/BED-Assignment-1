const sql = require("mssql");
const dbConfig = require("../dbConfig");

class News {
  constructor(newsid, headline, content, country) {
    this.newsid = newsid;
    this.headline = headline;
    this.content = content;
    this.country = country;
  }

//---------------GET ALL NEWS------------------
  static async getAllNews() {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM News`; 

    const request = connection.request();
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset.map(
      (row) => new News(row.newsid, row.headline, row.content, row.country)
    ); // Convert rows to News objects
  }

//---------------GET A SINGLE NEWS------------------
  static async getNewsById(newsid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `SELECT * FROM News WHERE newsid = @newsid`; // Parameterized query

    const request = connection.request();
    request.input("newsid", newsid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.recordset[0]
      ? new News(
          result.recordset[0].newsid,
          result.recordset[0].headline,
          result.recordset[0].content,
          result.recordset[0].country
        )
      : null; // Handle news not found
  }

  //--------------- POST A NEWS------------------
  static async createNews (newArticleData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `INSERT INTO News (headline, content, country) VALUES (@headline, @content, @country); SELECT SCOPE_IDENTITY() AS newsid;`; // Retrieve ID of inserted record

    const request = connection.request();
    request.input("headline", newArticleData.headline);
    request.input("content", newArticleData.content);
    request.input("country", newArticleData.country);

    const result = await request.query(sqlQuery);

    connection.close();

    // Retrieve the newly created news using its ID
    return this.getNewsById(result.recordset[0].newsid);
  }

   //-------------- PUT A NEWS------------------
  static async updateNews(newsid, newArticleData) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `UPDATE News SET headline = @headline, content = @content, country = @country WHERE newsid = @newsid`; // Parameterized query

    const request = connection.request();
    request.input("newsid", newsid);
    request.input("headline", newArticleData.headline|| null); // Handle optional fields
    request.input("content", newArticleData.content || null);
    request.input("country", newArticleData.country || null);

    await request.query(sqlQuery);

    connection.close();

    return this.getNewsById(newsid); // returning the updated news data
  }
  
    //--------------- DELETE A NEWS------------------
    static async deleteNews(newsid) {
    const connection = await sql.connect(dbConfig);

    const sqlQuery = `DELETE FROM News WHERE newsid = @newsid`; // Parameterized query

    const request = connection.request();
    request.input("newsid", newsid);
    const result = await request.query(sqlQuery);

    connection.close();

    return result.rowsAffected > 0; // Indicate success based on affected rows
  }
}

module.exports = News;