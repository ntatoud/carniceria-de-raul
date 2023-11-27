import mysql from "mysql2";
import { databaseCredentials } from "./index";

export const databaseCreate = (): void => {
  // Create a connection to MySQL server
  const connection = mysql.createConnection({
    multipleStatements: true,
    ...databaseCredentials,
  });
  // Execute SQL statements to create database and user
  connection.query(
    `
          CREATE DATABASE IF NOT EXISTS ${process.env.DATABASE_NAME};
          USE ${process.env.DATABASE_NAME};
      `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("Database created successfully");
    }
  );

  connection.query(
    ` 
      CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(50),
        surname VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        authorities ENUM('ROLE_USER', 'ROLE_ADMIN') NOT NULL,
        creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        phone_number VARCHAR(20)
        );
      
      
      CREATE TABLE IF NOT EXISTS products (
        product_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        unit ENUM("€/kg", "€/unidad"),
        stock INT NOT NULL,
        sale Boolean,
        sale_price DECIMAL(10, 2),
        image BLOB NOT NULL,
        description VARCHAR(2048) NOT NULL
        );
      
      CREATE TABLE IF NOT EXISTS categories (
          category_id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS product_categories (
        product_id INT,
        category_id INT,
        PRIMARY KEY (product_id, category_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id),
        FOREIGN KEY (category_id) REFERENCES categories(category_id)
      );

      CREATE TABLE IF NOT EXISTS orders (
        order_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        recovery_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        total_price DECIMAL(10, 2),
        comment VARCHAR(2048),
        FOREIGN KEY (user_id) REFERENCES users(user_id)
        );
          
      CREATE TABLE IF NOT EXISTS products_orders (
        order_id INT,
        product_id INT,
        quantite INT,
        PRIMARY KEY (order_id, product_id),
        FOREIGN KEY (order_id) REFERENCES orders(order_id),
        FOREIGN KEY (product_id) REFERENCES products(product_id)
       );
      `,
    (error: Error) => {
      if (error) throw new Error(error.message);
      console.log("Tables created successfully");
    }
  );
  // Close the connection
  connection.end();
};

databaseCreate();
