module.exports = {
  user: "booksapi_user", // Replace with your SQL Server login username
  password: "P@ssw0rd2006", // Replace with your SQL Server login password
  server: "localhost",
  database: "BED_assg2", //Replace with your database name
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};