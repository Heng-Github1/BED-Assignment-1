const sql = require("mssql");
const dbConfig = require("../dbConfig");

class Book {
  constructor(book_id, title, author, availability) {
    this.book_id = book_id;
    this.title = title;
    this.author = author;
    this.availability = availability;
  }

  // Retrieve list of all books 
  static async getAllBooks() {
    let pool;
    try {
      pool = await sql.connect(dbConfig);
      const result = await pool.request().query("SELECT book_id, title, author, availability FROM Books");

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
      const sqlQuery = `SELECT book_id, title, author, availability FROM Books WHERE book_id = @book_id`;
      const result = await pool
        .request()
        .input("book_id", sql.Int, book_id)
        .query(sqlQuery);

      return result.recordset.length > 0
        ? new Book(
            result.recordset[0].book_id,
            result.recordset[0].title,
            result.recordset[0].author,
            result.recordset[0].availability
          )
        : null;
    } catch (err) {
      console.error("Error fetching book by id:", err.message);
      throw err;
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
        .input("title", sql.VarChar, newBookData.title)
        .input("author", sql.VarChar, newBookData.author)
        .input("availability", sql.Char, newBookData.availability || null)
        .query(sqlQuery);

      const createdBookId = result.recordset[0].book_id;
      return this.getBookById(createdBookId);
    } catch (err) {
      console.error("Error creating book:", err.message);
      throw err;
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
        .input("book_id", sql.Int, book_id)
        .input("title", sql.VarChar, newBookData.title || null)
        .input("author", sql.VarChar, newBookData.author || null)
        .input("availability", sql.Char, newBookData.availability || null)
        .query(sqlQuery);

      return this.getBookById(book_id);
    } catch (err) {
      console.error("Error updating book:", err.message);
      throw err;
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
        .input("book_id", sql.Int, book_id)
        .query(sqlQuery);

      return result.rowsAffected > 0;
    } catch (err) {
      console.error("Error deleting book:", err.message);
      throw err;
    } finally {
      if (pool) pool.close();
    }
  }

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

      await pool.request()
        .input("availability", sql.Char, newAvailability)
        .input("book_id", sql.Int, book_id)
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
