import mysql from 'mysql2';
import { databaseCredentials } from './index';

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
      console.log('Database created successfully');
    }
  );

  connection.query(
    ` 
      CREATE TABLE IF NOT EXISTS users (
        userId INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        name VARCHAR(50),
        surname VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        salt VARCHAR(255) NOT NULL,
        address VARCHAR(255),
        city VARCHAR(255),
        postalCode VARCHAR(255),
        country VARCHAR(255),
        authorities ENUM('ROLE_USER', 'ROLE_ADMIN') NOT NULL,
        creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        phone VARCHAR(20)
        );
      
      
      CREATE TABLE IF NOT EXISTS products (
        productId INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(250) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        unit ENUM("€/kg", "€/unidad"),
        stock INT NOT NULL,
        sale Boolean,
        salePrice DECIMAL(10, 2),
        best Boolean,
        image VARCHAR(255) NOT NULL,
        description VARCHAR(2048) NOT NULL
        );
      
      CREATE TABLE IF NOT EXISTS categories (
          categoryId INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL
      );
  
      CREATE TABLE IF NOT EXISTS product_categories (
        productId INT,
        categoryId INT,
        PRIMARY KEY (productId, categoryId),
        FOREIGN KEY (productId) REFERENCES products(productId),
        FOREIGN KEY (categoryId) REFERENCES categories(categoryId)
      );

      CREATE TABLE IF NOT EXISTS users_cart_products (
        userId INT,
        productId INT,
        quantity INT,
        PRIMARY KEY (userId, productId),
        FOREIGN KEY (userId) REFERENCES users(userId),
        FOREIGN KEY (productId) REFERENCES products(productId)
        );

      CREATE TABLE IF NOT EXISTS orders (
        orderId INT AUTO_INCREMENT PRIMARY KEY,
        userId INT NOT NULL,
        orderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        recoveryDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        totalPrice DECIMAL(10, 2),
        comment VARCHAR(2048),
        FOREIGN KEY (userId) REFERENCES users(userId)
        );
          
      CREATE TABLE IF NOT EXISTS products_orders (
        orderId INT,
        productId INT,
        quantity INT,
        PRIMARY KEY (orderId, productId),
        FOREIGN KEY (orderId) REFERENCES orders(orderId),
        FOREIGN KEY (productId) REFERENCES products(productId)
       );
      `,
    (error: Error) => {
      if (error) throw new Error(error.message);
      console.log('Tables created successfully');
    }
  );
  // Close the connection
  connection.end();
};

databaseCreate();
