import { User } from '@/types/types.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { formatDate } from '@/lib/date/utils.js';
import i18next from '@/lib/i18n/config.js';

export const getOrderFromId = (
  req: Request,
  res: Response,
  id: string,
  onAdmin?: boolean
) => {
  const getOrderAndProduct = `SELECT \
    o.orderId, \
    o.userId, \
    po.quantity, \
    po.weight,
    o.orderDate, \
    o.recoveryDate, \
    o.totalPrice, \
    o.comment, \
    p.productId,
    p.name as productName,
    p.price as productPrice
    FROM \
    orders o \
    JOIN products_orders po ON o.orderId = po.orderId \
    JOIN products p ON po.productId = p.productId \
    WHERE \
    o.orderId = ${id};`;

  const connection = databaseConnect();

  connection.query(
    getOrderAndProduct,
    [id],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) {
        databaseError(error);
      } else {
        res.render('orderDetails.ejs', {
          orderProducts: results as (Partial<Product> & Partial<Order>)[],
          isLogged: req.session.isLogged,
          account: req.session.user,
          cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
          onAdmin,
          t: i18next.t,
        });
      }

      databaseDisconnect(connection);
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
    o.totalPrice, \
    o.isDone\
    FROM \
    orders o \
    JOIN users u ON o.userId = u.userId;';
  connection.query(
    getOrderQuery,
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) {
        databaseError(error);
      } else {
        const orders = sortByRecoveryDate(
          results as (Order & Partial<User>)[]
        ).map((order) => {
          order.orderDate = formatDate(order.orderDate);
          order.recoveryDate = formatDate(order.recoveryDate);
          return order;
        });
        res.render('orders.ejs', {
          orders: orders,
          isLogged: req.session.isLogged,
          account: req.session.user,
          cart: req.session.cart,
          t: i18next.t,
        });
      }
      databaseDisconnect(connection);
    }
  );
};

export const orderDelete = (res: Response, order: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users WHERE userId = ?;`;
  connection.query(deleteQuery, [order], (error: QueryError | null) => {
    if (error) databaseError(error);

    res.status(200).send('OK');

    databaseDisconnect(connection);
  });
};

export const orderStatusUpdate = (
  res: Response,
  orderId: string,
  isDone: string
) => {
  const orderStatusUpdateQuery =
    'UPDATE orders SET \
      isDone = ?\
      WHERE orderId = ?;';

  const connection = databaseConnect(`PUT /admin/orders/${orderId}`);
  connection.execute(
    orderStatusUpdateQuery,
    [+isDone, orderId],
    (error: QueryError | null) => {
      if (error) {
        databaseError(error, `PUT /admin/orders/${orderId}`);
        res.sendStatus(400);
      } else {
        res.status(200).send(isDone);
      }

      databaseDisconnect(connection, `PUT /admin/orders/${orderId}`);
    }
  );
};
export const sortByRecoveryDate = (orders: (Order & Partial<User>)[]) => {
  return orders?.sort((orderA, orderB) => {
    return (
      (typeof orderA.recoveryDate === 'string'
        ? new Date(orderA.recoveryDate)
        : orderA.recoveryDate
      ).getTime() -
      (typeof orderB.recoveryDate === 'string'
        ? new Date(orderB.recoveryDate)
        : orderB.recoveryDate
      ).getTime()
    );
  });
};
