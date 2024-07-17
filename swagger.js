const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./swagger-output.json"; // Output file for the spec
const routes = ["./app.js"]; // Path to your API route files

const doc = {
  info: {
    title: "SEA AWARENESS",
    description: "SEA AWARENESS is an application that provides the latest news information on the readiness of different South East Asian countries, while also spreading awareness into the hardships of the these countries.",
  },
  host: "localhost:3000", // Replace with your actual host if needed
};

swaggerAutogen(outputFile, routes, doc);