import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// Create connection. Make sure .env file has correct user and password.
const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  multipleStatements: true,
});

// Connect to mysql.
// Create database and table if either does not exist.
con.connect(function (err, _) {
  if (err) throw err;
  console.log("Database connected.");

  con.query(
    `
      CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};

      USE ${process.env.DB_NAME};

      CREATE TABLE IF NOT EXISTS users (
        Id int NOT NULL AUTO_INCREMENT,
        Name varchar(500) NOT NULL,
        LastVisited datetime NOT NULL,
        PRIMARY KEY (Id),
        UNIQUE KEY Id_UNIQUE (Id)
      );
    `,
    (err) => {
      if (err) throw err;
      console.log("Database created/existing.");
    }
  );
});

export default con.promise();
