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
    product.stock,
    product.sale,
    product.salePrice ?? null,
    product.image ?? '',
    product.description,
  ];

  const createProductQuery =
    'INSERT INTO products (name, price, stock, sale, salePrice, image, description) VALUES (?, ?, ?, ?, ?, ?, ?);';

  connection.query(
    createProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      } else {
        const getProductId = `SELECT productId FROM products WHERE name= ?;`;
        connection.execute(
          getProductId,
          [product.name],
          (error: QueryError | null, resultProduct: RowDataPacket[]) => {
            if (error) {
              databaseError(error);
              res.status(404).send('Could not find product');
            } else if (resultProduct.length) {
              const productId = resultProduct[0]?.productId;
              const getCategoryId = `SELECT categoryId FROM categories WHERE name= ?`;
              connection.execute(
                getCategoryId,
                [product.category ?? 'Pollo'],
                (error: QueryError | null, resultCategory: RowDataPacket[]) => {
                  if (error) {
                    databaseError(error);
                    res.status(404).send('Could not find category');
                    res.sendStatus(404);
                  } else if (resultCategory.length) {
                    const categoryId = resultCategory[0]?.categoryId;
                    const productCategoriesInsert = `INSERT INTO product_categories (productId, categoryId) VALUES (?, ?);`;
                    connection.execute(
                      productCategoriesInsert,
                      [+productId, +categoryId],
                      (error: QueryError | null) => {
                        if (error) {
                          databaseError(error);
                          res.sendStatus(500);
                        } else {
                          res.sendStatus(200);
                        }

                        databaseDisconnect(connection);
                      }
                    );
                  }
                }
              );
            }
          }
        );
      }
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
  // To use once merged in main !
  // const getProductQuery =
  //   "SELECT p.product_id, p.name p.price, p.stock, p.sale, p.salerice, p.image, p.description, c.name AS category FROM products p JOIN product_category pc ON p.product_id = pc.product_id JOIN category c ON pc.category_id = c.id;";
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
  const getProductsQuery =
    'SELECT p.*, c.name as category FROM products p \
  JOIN product_categories pc ON p.productId = pc.productId\
  JOIN categories c ON c.categoryId = pc.categoryId;';

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
