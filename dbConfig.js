require('dotenv').config();

const dbConfig = {
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE, 
  trustServerCertificate: true,
  options: {
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined, 
    connectionTimeout: process.env.DB_CONNECTION_TIMEOUT ? parseInt(process.env.DB_CONNECTION_TIMEOUT, 10) : 15000, 
  },
};

module.exports = dbConfig;
