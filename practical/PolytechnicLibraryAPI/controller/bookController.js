const { sql } = require('../dbConfig');  // Adjust the path if necessary

async function getAllBooks(req, res) {
  try {
    const result = await sql.query`SELECT * FROM Books`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

async function updateBookAvailability(req, res) {
  const { bookId } = req.params;
  const { availability } = req.body;

  try {
    await sql.query`UPDATE Books SET availability = ${availability} WHERE book_id = ${bookId}`;
    res.json({ message: 'Book availability updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}

module.exports = { getAllBooks, updateBookAvailability };
