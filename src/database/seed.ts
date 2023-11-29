import { databaseConnect } from ".";

export const databaseFill = (): void => {
  const connection = databaseConnect();

  connection.query(
    `INSERT INTO users (email, name, surname, password, salt, address, authorities, creation_date, phone_number)
      VALUES
      ('john.doe@example.com', 'John', 'Doe', 'hashed_password_1', 123456789, '123 Main St', 'ROLE_USER', '2022-01-01', '123-456-7890'),
      ('jane.smith@example.com', 'Jane', 'Smith', 'hashed_password_2', 123456789, '456 Oak St', 'ROLE_ADMIN', '2022-01-02', '987-654-3210'),
      ('alice.jones@example.com', 'Alice', 'Jones', 'hashed_password_3', 123456789, '789 Maple St', 'ROLE_USER', '2022-01-03', '555-123-4567');`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("👤 👉 Table 'users' seeded successfully");
    }
  );

  connection.query(
    `INSERT INTO categories (name)
      VALUES
      ('Ternera'),
      ('Pollo'),
      ('Cerdo'),
      ('Elaborado');`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("👤 👉 Table 'categories' seeded successfully");
    }
  );

  connection.query(
    `
    INSERT INTO products (name, price, stock, sale, sale_price, image, description)
    VALUES
        ('Product A', 29.99, 100, true, 19.99, 'base64_encoded_image_data_A', 'Long description for Product A'),
        ('Product B', 39.99,  50, false, NULL, 'base64_encoded_image_data_B', 'Long description for Product B'),
        ('Product C', 49.99,  75, true, 39.99, 'base64_encoded_image_data_C', 'Long description for Product C');`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("📦 👉 Table 'products' seeded successfully");
    }
  );

  connection.query(
    `INSERT INTO product_categories (product_id, category_id)
      VALUES
      (1, 1),
      (2, 2),
      (3, 3);`,

    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("👤 👉 Table 'product_categories' seeded successfully");
    }
  );
  connection.query(
    `
    INSERT INTO orders (user_id, order_date, recovery_date, total_price, comment)
    VALUES
        (1, '2022-01-05', '2022-01-10', 59.98, 'Order comment for User 1'),
        (2, '2022-01-08', '2022-01-15', 79.98, 'Order comment for User 2'),
        (3, '2022-01-10', '2022-01-18', 89.97, 'Order comment for User 3');`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("🛒 👉 Table 'orders' seeded successfully");
    }
  );

  connection.query(
    `
    INSERT INTO products_orders (order_id, product_id, quantite)
    VALUES
        (1, 1, 2),
        (1, 2, 1),
        (2, 2, 3),
        (3, 3, 1);`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("📦🛒 👉 Table 'products_orders' seeded successfully");
    }
  );

  connection.end();
};

databaseFill();
