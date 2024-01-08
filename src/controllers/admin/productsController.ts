import { toastDispatch } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';

export const productCreate = (res: Response, product: Partial<Product>) => {
  const connection = databaseConnect();
  const queryParams = [
    product.name,
    product.price,
    product.unit,
    product.stock,
    product.sale,
    product.salePrice ?? null,
    product.image ?? null,
    product.description,
    product.category ?? 'Ternera',
  ];

  const createProductQuery =
    'INSERT INTO products (name, price, unit, stock, sale, salePrice, image, description, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);';

  connection.query(
    createProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      } else {
        res.sendStatus(200);
      }
      databaseDisconnect(connection);
    }
  );
};

export const productUpdate = (res: Response, product: Product, id: string) => {
  const connection = databaseConnect();
  const queryParams = [
    product.name,
    product.price,
    product.stock,
    product.sale,
    product.salePrice ?? null,
    product.image ?? '',
    product.description,
    id,
  ];

  const updateProductQuery =
    'UPDATE products SET name = ?, price = ?, stock = ?, sale = ?, salePrice = ?, image = ?, description = ? WHERE productId = ?;';
  connection.query(
    updateProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) databaseError(error);
      else {
        res.sendStatus(200);
      }

      databaseDisconnect(connection);
    }
  );
};

export const getProductToUpdate = (
  req: Request,
  res: Response,
  productId: string
) => {
  const connection = databaseConnect();
  const getProductQuery = 'SELECT * FROM products WHERE productId = ?;';

  connection.query(
    getProductQuery,
    [productId],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) databaseError(error);

      const product = result[0] as Product;

      res.render('productUpdate.ejs', {
        product: product,
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
      });

      databaseDisconnect(connection);
    }
  );
};

export const productDelete = (res: Response, productId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM products WHERE productId = ?;`;
  connection.query(deleteQuery, [productId], (error: QueryError | null) => {
    if (error) databaseError(error);

    res.status(200).send('OK');

    databaseDisconnect(connection);
  });
};

export const getProductList = (
  req: Request,
  res: Response
  // category?: string
) => {
  const connection = databaseConnect();
  const getProductsQuery = 'SELECT * FROM products';

  connection.query(
    getProductsQuery,
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) databaseError(error);

      res.render('products.ejs', {
        products: results as Product[],
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        cart: req.session.cart,
      });

      databaseDisconnect(connection);
    }
  );
};

export const addCategory = () => {};
