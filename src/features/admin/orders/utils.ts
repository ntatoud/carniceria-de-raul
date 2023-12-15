import { Order } from '@/features/types';
import { databaseConnect } from '../../../database';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';

export const getOrderFromId = (req: Request, res: Response, id: string) => {
  const getOrderAndProduct = `SELECT \
    o.orderId, \
    o.userId, \
    po.quantity, \
    o.orderDate, \
    o.recoveryDate, \
    o.totalPrice, \
    o.comment, \
    pc.productId, \
    p.name AS productName, \
    p.price AS productPrice, \
    p.unit AS productUnit, \
    p.stock AS productStock, \
    p.sale AS productSale, \
    p.salePrice AS productSalePrice, \
    p.best AS productBest, \
    p.image AS productImage, \
    p.description AS productDescription, \
    c.categoryId, \
    c.name AS categoryName \
    FROM \
    orders o \
    JOIN products_orders po ON o.orderId = po.orderId \
    JOIN products p ON po.productId = p.productId \
    JOIN product_categories pc ON p.productId = pc.productId \
    JOIN categories c ON pc.categoryId = c.categoryId \
    WHERE \
    o.orderId = ${id};`;

  const connection = databaseConnect();

  connection.query(
    getOrderAndProduct,
    [id],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) {
        throw new Error(error.message);
      } else {
        res.render('orderDetails.ejs', {
          orderProducts: results as (Partial<Product> & Partial<Order>)[],
          isLogged: req.session.isLogged,
          account: req.session.user,
          cart: req.session.cart,
        });
      }
    }
  );
};

export const getOrderList = (req: Request, res: Response) => {
  const connection = databaseConnect();

  const getOrderQuery =
    'SELECT \
    o.orderId, \
    o.userId, \
    u.email, \
    u.name, \
    u.surname, \
    o.orderDate, \
    o.recoveryDate, \
    o.totalPrice \
    FROM \
    orders o \
    JOIN users u ON o.userId = u.userId;';
  connection.query(
    getOrderQuery,
    (error: QueryError, results: RowDataPacket[]) => {
      if (error) {
        throw new Error(error.message);
      } else {
        res.render('orders.ejs', {
          orders: results,
          isLogged: req.session.isLogged,
          account: req.session.user,
          cart: req.session.cart,
        });
      }
    }
  );
};

export const orderDelete = (res: Response, order: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users WHERE userId = ?;`;
  connection.query(deleteQuery, [order], (error: QueryError | null) => {
    if (error) throw new Error(error.message);

    res.status(200).send('OK');
  });
};
