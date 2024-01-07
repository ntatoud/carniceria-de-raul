import { generateSaltHashedPassword } from '@/controllers/auth/authController.js';
import { databaseConnect, databaseDisconnect, databaseError } from './index.js';
import { QueryError } from 'mysql2';
import { explicitLog } from '@/functions/index.js';

export const databaseFill = (): void => {
  const connection = databaseConnect();
  const { salt: saltAdmin, hashPwd: pwdAdmin } =
    generateSaltHashedPassword('admin');
  const { salt: saltUser, hashPwd: pwdUser } =
    generateSaltHashedPassword('user');
  connection.execute(
    `INSERT INTO users (email, name, surname, password, salt, address, authorities, phone)
      VALUES
      ('admin@admin.com', 'admin', 'admin', ?, ?, '123 Main St', 'ROLE_ADMIN','123-456-7890'),
      ('user@user.com', 'user', 'user', ?, ?, '456 Oak St', 'ROLE_USER', '987-654-3210');`,
    [pwdAdmin, saltAdmin, pwdUser, saltUser],
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("👤 👉 Table 'users' seeded successfully");
    }
  );

  /* TERNERA */
  connection.query(
    `
    INSERT INTO products (name, price, category, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('CHULETÓN DE TERNERA', 22.99, 'Ternera', '€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('LOMO ALTO DE TERNERA', 23.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('LOMO BAJO DE TERNERA', 23.99, 'Ternera','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('SOLOMILLO DE TERNERA ENTERO', 45.00, 'Ternera', '€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('SOLOMILLO DE TERNERA AL CORTE ', 50.00, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DE AGUJA', 14.50, 'Ternera','€/kg', 100, true, 12.50, false, '', 'Product Description'),
        ('FILETES DE TAPA', 15.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DE ESPALDILLA', 14.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DEL NERVIO DE LA ESPALDILLA ', 14.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DE BABILLA', 16.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DE CADERA', 16.99, 'Ternera','€/kg', 100, true, 13.99, false, '', 'Product Description'),
        ('FILETES DE TAPILLA', 16.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('ALETA DE TERNERA', 13.99, 'Ternera','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('VACÍO DE TERNERA ', 13.99, 'Ternera','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('MAGRA DE TERNERA', 12.99, 'Ternera','€/kg', 100, true, 11.99, false, '', 'Product Description'),
        ('FALDA DE TERNERA', 11.99, 'Ternera','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('ENTRAÑA DE TERNERA', 13.99, 'Ternera','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('REDONDO DE TERNERA', 14.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('MORCILLO DE TERNERA', 13.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CULATA DE TERNERA', 13.99, 'Ternera','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('FILETE DE CONTRA ', 14.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('PEZ DE TERNERA', 13.99, 'Ternera','€/kg', 100, false, NULL, false, '', 'Product Description');
        `,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("📦 👉 Table 'products' seeded with Ternera successfully");
    }
  );

  /* CERDO */
  connection.query(
    `
    INSERT INTO products (name, price, category,  unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('COSTILLARES DE CERDO', 7.99, 'Cerdo', '€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('COSTILLAS TIRAS ', 12.99, 'Cerdo','€/kg', 100, true, 10.99, false, '', 'Product Description'),
        ('PANCETA', 6.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DE CERDO', 8.49, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CHULETAS DE CERDO PALO ', 8.49, 'Cerdo','€/kg', 100, true, 5.99, false, '', 'Product Description'),
        ('CHULETAS DE AGUJA', 6.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CINTA DE LOMO FRESCA', 9.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('SOLOMILLO DE CERDO', 11.99, 'Cerdo','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('CARRILLADAS DE CERDO ', 13.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CHULETAS DE CERDO IBÉRICAS', 19.99, 'Cerdo','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('SECRETO DE CERDO IBÉRICO ', 18.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CODILLO FRESCO ', 7.99, 'Cerdo','€/kg', 100, true, 6.99, false, '', 'Product Description'),
        ('PATA', 5.99, 'Cerdo','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('RABO ', 5.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('OREJA', 5.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('MORRO', 5.99, 'Cerdo','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('PAPADA ', 6.99, 'Cerdo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('TOCINO FRESCO BAJ0', 5.99, 'Cerdo','€/kg', 0, false, NULL, true, '', 'Product Description'),
        ('TOCINO FRESCO ALTO IBÉRICO', 5.99, 'Cerdo','€/kg', 0, false, NULL, false, '', 'Product Description');
        `,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("📦 👉 Table 'products' seeded with Cerdo successfully");
    }
  );

  /* POLLO */
  connection.query(
    `
    INSERT INTO products (name, price, category, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('POLLO ENTERO', 4.50, 'Pollo', '€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('POLLO AMARILLO', 5.99, 'Pollo','€/kg', 100, true, 4.99, false, '', 'Product Description'),
        ('GALLINA ENTERA O MEDIA', 4.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('GALLINA POR CUARTOS', 5.99, 'Pollo','€/kg', 0, false, NULL, true, '', 'Product Description'),
        ('FILETES DE POLLO', 9.99, 'Pollo','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('TRASEROS DE POLLO', 4.99, 'Pollo','€/kg', 0, true, 3.99, true, '', 'Product Description'),
        ('ALAS DE POLLO', 5.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('MUSLOS DE POLLO', 4.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CONTRAMUSLOS DE POLLO', 6.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FILETES DE PAVO', 11.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('HIGADITOS DE POLLO', 4.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CONEJO', 9.99, 'Pollo','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CODORNICES ', 2, 'Pollo','€/unidad', 100, true, 1.50, false, '', 'Product Description'),
        ('HUEVOS CAMPEROS', 1.90, 'Pollo','€/unidad', 100, false, NULL, false, '', 'Product Description'),
        ('HUEVOS MORENOS', 1.30, 'Pollo','€/unidad', 100, false, NULL, false, '', 'Product Description'),
        ('HUEVOS BLANCOS', 1.30, 'Pollo','€/unidad', 100, false, NULL, false, '', 'Product Description');
        `,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("📦 👉 Table 'products' seeded with Pollo successfully");
    }
  );

  /* ELABORADOS */
  connection.query(
    `
    INSERT INTO products (name, price, category, unit, stock, sale, salePrice, best, image, description)
    VALUES
        ('VINO PARA COCINAR ', 5.00, 'Elaborado','€/kg', 0, false, NULL, true, '', 'Product Description'),
        ('CALLOS ROGUSA 500GR', 5.00, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('OREJA ADOBADA ROGUSA 5OOGR', 5.00, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('OREJA COCIDA BLANCA ROGUSA 5OOGR', 5.00, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('MINUTEJOS ROGUSA 5OOGR', 5.00, 'Elaborado','€/kg', 100, true, 4.00, false, '', 'Product Description'),
        ('LONGANIZA BLANCA', 9.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('MORCILLA DE ARROZ', 9.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('MORCILLA DE CEBOLLA LA RIBERA', 9.99, 'Elaborado','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('CHORIZO DE PINCHO DULCE ', 9.99, 'Elaborado','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('CHORIZO DE PINCHO PICANTE', 9.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CHORIZO CASERO', 9.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CHISTORRA PAMPLONICA ', 2.50, 'Elaborado','€/unidad', 100, true, 2.00, false, '', 'Product Description'),
        ('CODILLO ASADO TELLO', 6.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CODILLO SALMUERIZADO ', 7.99, 'Elaborado','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('CINTA DE LOMO ADOBADA', 9.99, 'Elaborado','€/kg', 100, true, 7.99, false, '', 'Product Description'),
        ('CINTA DE LOMO AL AJILLO', 9.99, 'Elaborado','€/kg', 100, true, 7.99, true, '', 'Product Description'),
        ('CINTA DE LOMO IBÉRICA', 24.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('PINCHOS MORUNOS ROJOS', 6.99, 'Elaborado','€/kg', 0, false, NULL, false, '', 'Product Description'),
        ('COSTILLAS ADOBADAS', 7.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CHULETA DE SAJONIA AHUMADA', 9.49, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('HAMBURGUESA DE TERNERA', 12.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('HAMBURGUESA DE CERDO IBÉRICA', 11.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('HAMBURGUESA DE POLLO', 10.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CROQUETAS DE JAMÓN IBÉRICO', 12.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('PECHUGAS A LA VILLAROY', 12.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('FLAMENQUINES DE JAMÓN Y QUESO ', 12.99, 'Elaborado','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('CINTA DE LOMO CON PIMIENTO VERDE ', 12.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('TARTA DE QUESO', 16.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CACHOPO DE TERNERA CON JAMÓN Y QUESO ', 21.99, 'Elaborado','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('PAVO ADOBADO LONCHAS ', 9.79, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('PATATAS RELLENAS', 12.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description'),
        ('CALDO DE POLLO', 4.99, 'Elaborado','€/kg', 100, false, NULL, true, '', 'Product Description'),
        ('CALDO DE JAMÓN', 4.99, 'Elaborado','€/kg', 100, false, NULL, false, '', 'Product Description');
        `,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("📦 👉 Table 'products' seeded with Elaborados successfully");
    }
  );

  connection.query(
    `
    INSERT INTO users_cart_products (userId, ProductId, totalQuantity, weight)
    VALUES
        (1, 1, 2, 100),
        (1, 2, 1, 200),
        (1, 4, 1, 300),
        (2, 3, 2, 200),
        (2, 5, 3, 300);`,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("🛒 👉 Table 'users_carts_products' seeded successfully");
    }
  );

  connection.query(
    `
    INSERT INTO orders (userId, recoveryDate, totalPrice, comment, isDone)
    VALUES
        (1 ,'2023-12-22' ,59.98 ,'Order comment for User 1', false),
        (2 ,'2023-12-22' ,79.98, 'Order comment for User 2', true);`,

    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("🛒 👉 Table 'orders' seeded successfully");
    }
  );

  connection.query(
    `
    INSERT INTO products_orders (orderId, productId, quantity, weight)
    VALUES
        (1, 1, 2, 100),
        (1, 2, 1, 200),
        (2, 2, 3, 100);`,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      }
      explicitLog("📦🛒 👉 Table 'products_orders' seeded successfully");
    }
  );

  databaseDisconnect(connection);
};

databaseFill();
