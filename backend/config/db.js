const mysql = require("mysql2");
require("dotenv").config();

// Create a connection to the Cloud SQL instance

const connectDB = () => {
  const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.DB_USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  });

  // Connect to the database
  connection.connect((err) => {
    if (err) {
      console.log("error with connecting:", err);
      process.exit(1);
    }
    console.log("MySql Connected");
  });

  return connection;
};

module.exports = connectDB;
