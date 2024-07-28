module.exports = {
  user: "ShibaInu", // Replace with your SQL Server login username
  password: "shiba123", // Replace with your SQL Server login password
  server: "localhost",
  database: "bed_db", //Replace with your database name
  trustServerCertificate: true,
  options: {
    port: 1433, // Default SQL Server port
    connectionTimeout: 60000, // Connection timeout in milliseconds
  },
};