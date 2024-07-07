const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
  constructor(title, author, availability) {
    this.title = title;
    this.author = author;
    this.availability = availability;
  }

  // Retrieve list of all books 
  static async getAllBooks() {
    let pool;
    try {
        pool = await sql.connect(dbConfig);
        const result = await pool.request().query("SELECT * FROM Books");

        // Map rows to Book objects
        const books = result.recordset.map(row => new Book(row.book_id, row.title, row.author, row.availability));
        
        return books;
    } catch (err) {
        console.error("Error fetching all books:", err.message);
        throw err;
    } finally {
        if (pool) pool.close();
    }
}


  static async getBookById(book_id) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const sqlQuery = `SELECT * FROM Books WHERE book_id = @book_id`;
      const result = await pool
        .request()
        .input("book_id", book_id)
        .query(sqlQuery);

      return result.recordset.length > 0
        ? new Book(
            result.recordset[0].book_id,
            result.recordset[0].title,
            result.recordset[0].author,
            result.recordset[0].availability
          )
        : null;
    } finally {
      if (pool) pool.close();
    }
  }

  static async createBook(newBookData) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const sqlQuery = `
        INSERT INTO Books (title, author, availability)
        VALUES (@title, @author, @availability);
        SELECT SCOPE_IDENTITY() AS book_id;
      `;

      const result = await pool
        .request()
        .input("title", newBookData.title)
        .input("author", newBookData.author)
        .input("availability", newBookData.availability || null)
        .query(sqlQuery);

      const createdBookId = result.recordset[0].book_id;
      return this.getBookById(createdBookId);
    } finally {
      if (pool) pool.close();
    }
  }

  static async updateBook(book_id, newBookData) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const sqlQuery = `
        UPDATE Books
        SET title = @title, author = @author, availability = @availability
        WHERE book_id = @book_id;
      `;

      await pool
        .request()
        .input("book_id", book_id)
        .input("title", newBookData.title || null)
        .input("author", newBookData.author || null)
        .input("availability", newBookData.availability || null)
        .query(sqlQuery);

      return this.getBookById(book_id);
    } finally {
      if (pool) pool.close();
    }
  }

  static async deleteBook(book_id) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const sqlQuery = `DELETE FROM Books WHERE book_id = @book_id`;
      const result = await pool
        .request()
        .input("book_id", book_id)
        .query(sqlQuery);

      return result.rowsAffected > 0;
    } finally {
      if (pool) pool.close();
    }
  }

  /*static async countBooks() {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const sqlQuery = `SELECT COUNT(*) AS count FROM Books`;
      const result = await pool.request().query(sqlQuery);

      return result.recordset[0].count;
    } finally {
      if (pool) pool.close();
    }
  }*/

static async updateBookAvailability(book_id, newAvailability) {
    let pool;
    try {
      pool = await sql.connect(dbConfig);

      // Update query
      const sqlQuery = `
        UPDATE Books
        SET availability = @availability
        WHERE book_id = @book_id
      `;

      // Execute the update query
      await pool.request()
        .input("availability", newAvailability)
        .input("book_id", book_id)
        .query(sqlQuery);

      // Fetch and return the updated book object
      return await this.getBookById(book_id);
    } catch (err) {
      console.error("Error updating book availability:", err.message);
      throw err;
    } finally {
      if (pool) pool.close();
    }
  }
}

module.exports = Book;