import { databaseConnect } from ".";

export const databaseFill = (): void => {
  const connection = databaseConnect();

  connection.query(
    `INSERT INTO users (email, name, surname, password, salt, address, authorities, creationDate, phone)
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
      ('Cerdo'),
      ('Pollo'),
      ('Elaborado');`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("👤 👉 Table 'categories' seeded successfully");
    }
  );

  /* TERNERA */
  connection.query(
    `
    INSERT INTO products (name, price, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('CHULETÓN DE TERNERA', 22.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('LOMO ALTO DE TERNERA', 23.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('LOMO BAJO DE TERNERA', 23.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('SOLOMILLO DE TERNERA ENTERO', 45.00, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('SOLOMILLO DE TERNERA AL CORTE ', 50.00, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DE AGUJA', 14.50, '€/kg', 100, true, 12.50, false, '.', 'Product Description'),
        ('FILETES DE TAPA', 15.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DE ESPALDILLA', 14.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DEL NERVIO DE LA ESPALDILLA ', 14.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DE BABILLA', 16.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DE CADERA', 16.99, '€/kg', 100, true, 13.99, false, '.', 'Product Description'),
        ('FILETES DE TAPILLA', 16.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('ALETA DE TERNERA', 13.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('VACÍO DE TERNERA ', 13.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('MAGRA DE TERNERA', 12.99, '€/kg', 100, true, 11.99, false, '.', 'Product Description'),
        ('FALDA DE TERNERA', 11.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('ENTRAÑA DE TERNERA', 13.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('REDONDO DE TERNERA', 14.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('MORCILLO DE TERNERA', 13.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CULATA DE TERNERA', 13.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('FILETE DE CONTRA ', 14.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('PEZ DE TERNERA', 13.99, '€/kg', 100, false, NULL, false, '.', 'Product Description');
        `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("📦 👉 Table 'products' seeded with Ternera successfully");
    }
  );

  connection.query(
    `INSERT INTO product_categories (productId, categoryId)
      VALUES
      (1, 1),
      (2, 1),
      (3, 1),
      (4, 1),
      (5, 1),
      (6, 1),
      (7, 1),
      (8, 1),
      (9, 1),
      (10, 1),
      (11, 1),
      (12, 1),
      (13, 1),
      (14, 1),
      (15, 1),
      (16, 1),
      (17, 1),
      (18, 1),
      (19, 1),
      (20, 1),
      (21, 1),
      (22, 1);`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log(
        "👤 👉 Table 'product_categories' seeded with Ternera successfully"
      );
    }
  );

  /* CERDO */
  connection.query(
    `
    INSERT INTO products (name, price, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('COSTILLARES DE CERDO', 7.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('COSTILLAS TIRAS ', 12.99, '€/kg', 100, true, 10.99, false, '.', 'Product Description'),
        ('PANCETA', 6.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DE CERDO', 8.49, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CHULETAS DE CERDO PALO ', 8.49, '€/kg', 100, true, 5.99, false, '.', 'Product Description'),
        ('CHULETAS DE AGUJA', 6.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CINTA DE LOMO FRESCA', 9.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('SOLOMILLO DE CERDO', 11.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('CARRILLADAS DE CERDO ', 13.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CHULETAS DE CERDO IBÉRICAS', 19.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('SECRETO DE CERDO IBÉRICO ', 18.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CODILLO FRESCO ', 7.99, '€/kg', 100, true, 6.99, false, '.', 'Product Description'),
        ('PATA', 5.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('RABO ', 5.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('OREJA', 5.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('MORRO', 5.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('PAPADA ', 6.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('TOCINO FRESCO BAJ0', 5.99, '€/kg', 0, false, NULL, true, '.', 'Product Description'),
        ('TOCINO FRESCO ALTO IBÉRICO', 5.99, '€/kg', 0, false, NULL, false, '.', 'Product Description');
        `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("📦 👉 Table 'products' seeded with Cerdo successfully");
    }
  );

  connection.query(
    `INSERT INTO product_categories (productId, categoryId)
      VALUES
      (23, 2),
      (24, 2),
      (25, 2),
      (26, 2),
      (27, 2),
      (28, 2),
      (29, 2),
      (30, 2),
      (31, 2),
      (32, 2),
      (33, 2),
      (34, 2),
      (35, 2),
      (36, 2),
      (37, 2),
      (38, 2),
      (39, 2),
      (40, 2),
      (41, 2);`,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log(
        "👤 👉 Table 'product_categories' seeded with Cerdo successfully"
      );
    }
  );

  /* POLLO */
  connection.query(
    `
    INSERT INTO products (name, price, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('POLLO ENTERO', 4.50, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('POLLO AMARILLO', 5.99, '€/kg', 100, true, 4.99, false, '.', 'Product Description'),
        ('GALLINA ENTERA O MEDIA', 4.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('GALLINA POR CUARTOS', 5.99, '€/kg', 0, false, NULL, true, '.', 'Product Description'),
        ('FILETES DE POLLO', 9.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('TRASEROS DE POLLO', 4.99, '€/kg', 0, true, 3.99, true, '.', 'Product Description'),
        ('ALAS DE POLLO', 5.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('MUSLOS DE POLLO', 4.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CONTRAMUSLOS DE POLLO', 6.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FILETES DE PAVO', 11.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('HIGADITOS DE POLLO', 4.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CONEJO', 9.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CODORNICES ', 2, '€/unidad', 100, true, 1.50, false, '.', 'Product Description'),
        ('HUEVOS CAMPEROS', 1.90, '€/unidad', 100, false, NULL, false, '.', 'Product Description'),
        ('HUEVOS MORENOS', 1.30, '€/unidad', 100, false, NULL, false, '.', 'Product Description'),
        ('HUEVOS BLANCOS', 1.30, '€/unidad', 100, false, NULL, false, '.', 'Product Description');
        `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("📦 👉 Table 'products' seeded with Pollo successfully");
    }
  );
  connection.query(
    `INSERT INTO product_categories (productId, categoryId)
      VALUES
      (42, 3),
      (43, 3),
      (44, 3),
      (45, 3),
      (46, 3),
      (47, 3),
      (48, 3),
      (49, 3),
      (50, 3),
      (51, 3),
      (52, 3),
      (53, 3),
      (54, 3),
      (55, 3),
      (56, 3),
      (57, 3);
    `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log(
        "👤 👉 Table 'product_categories' seeded with Pollo successfully"
      );
    }
  );

  /* ELABORADOS */
  connection.query(
    `
    INSERT INTO products (name, price, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('VINO PARA COCINAR ', 5.00, '€/kg', 0, false, NULL, true, '.', 'Product Description'),
        ('CALLOS ROGUSA 500GR', 5.00, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('OREJA ADOBADA ROGUSA 5OOGR', 5.00, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('OREJA COCIDA BLANCA ROGUSA 5OOGR', 5.00, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('MINUTEJOS ROGUSA 5OOGR', 5.00, '€/kg', 100, true, 4.00, false, '.', 'Product Description'),
        ('LONGANIZA BLANCA', 9.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('MORCILLA DE ARROZ', 9.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('MORCILLA DE CEBOLLA LA RIBERA', 9.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('CHORIZO DE PINCHO DULCE ', 9.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('CHORIZO DE PINCHO PICANTE', 9.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CHORIZO CASERO', 9.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CHISTORRA PAMPLONICA ', 2.50, '€/unidad', 100, true, 2.00, false, '.', 'Product Description'),
        ('CODILLO ASADO TELLO', 6.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CODILLO SALMUERIZADO ', 7.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('CINTA DE LOMO ADOBADA', 9.99, '€/kg', 100, true, 7.99, false, '.', 'Product Description'),
        ('CINTA DE LOMO AL AJILLO', 9.99, '€/kg', 100, true, 7.99, true, '.', 'Product Description'),
        ('CINTA DE LOMO IBÉRICA', 24.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('PINCHOS MORUNOS ROJOS', 6.99, '€/kg', 0, false, NULL, false, '.', 'Product Description'),
        ('COSTILLAS ADOBADAS', 7.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CHULETA DE SAJONIA AHUMADA', 9.49, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('HAMBURGUESA DE TERNERA', 12.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('HAMBURGUESA DE CERDO IBÉRICA', 11.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('HAMBURGUESA DE POLLO', 10.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CROQUETAS DE JAMÓN IBÉRICO', 12.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('PECHUGAS A LA VILLAROY', 12.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('FLAMENQUINES DE JAMÓN Y QUESO ', 12.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('CINTA DE LOMO CON PIMIENTO VERDE ', 12.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('TARTA DE QUESO', 16.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CACHOPO DE TERNERA CON JAMÓN Y QUESO ', 21.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('PAVO ADOBADO LONCHAS ', 9.79, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('PATATAS RELLENAS', 12.99, '€/kg', 100, false, NULL, false, '.', 'Product Description'),
        ('CALDO DE POLLO', 4.99, '€/kg', 100, false, NULL, true, '.', 'Product Description'),
        ('CALDO DE JAMÓN', 4.99, '€/kg', 100, false, NULL, false, '.', 'Product Description');
        `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log("📦 👉 Table 'products' seeded with Elaborados successfully");
    }
  );
  connection.query(
    `INSERT INTO product_categories (productId, categoryId)
      VALUES
      (58, 4),
      (59, 4),
      (60, 4),
      (61, 4),
      (62, 4),
      (63, 4),
      (64, 4),
      (65, 4),
      (66, 4),
      (67, 4),
      (68, 4),
      (69, 4),
      (70, 4),
      (71, 4),
      (72, 4),
      (73, 4),
      (74, 4),
      (75, 4),
      (76, 4),
      (77, 4),
      (78, 4),
      (79, 4),
      (80, 4),
      (81, 4),
      (82, 4),
      (83, 4),
      (84, 4),
      (85, 4),
      (86, 4),
      (87, 4),
      (88, 4),
      (89, 4),
      (90, 4);
        `,
    (error: Error) => {
      if (error) {
        throw new Error(error.message);
      }
      console.log(
        "👤 👉 Table 'product_categories' seeded with Elaborados successfully"
      );
    }
  );

  connection.query(
    `
    INSERT INTO orders (userId, orderDate, recoveryDate, totalPrice, comment)
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
    INSERT INTO products_orders (orderId, productId, quantite)
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
