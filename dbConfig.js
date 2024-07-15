module.exports = {
    user: "booksapi_user", // Replace with your SQL Server login username
    password: "46777", // Replace with your SQL Server login password
    server: "localhost",
    database: "BED_Assignment_DB_dan", //Replace with your database name
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };