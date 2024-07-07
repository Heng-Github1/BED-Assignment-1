const sql = require('mssql');
require('dotenv').config();

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function connectDB() {
  try {
    await sql.connect(config);
    console.log('Connected to the database');
  } catch (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
}

async function closeDB() {
  try {
    await sql.close();
    console.log('Disconnected from the database');
  } catch (err) {
    console.error('Database disconnection failed:', err);
  }
}

module.exports = { sql, connectDB, closeDB };