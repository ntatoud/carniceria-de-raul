import { toastDispatch } from '@/components/toast/index.js';
import { databaseConnect, databaseError } from '@/database/index.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import i18next from '@/lib/i18n/config.js';

export const getOrdersByUserId = (
  req: Request,
  res: Response,
  userId: number
) => {
  const connection = databaseConnect();
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
    o.userId = ?;`;
  connection.execute(
    getOrderAndProduct,
    [userId],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) databaseError(error);
      if (!results?.length)
        res.render('my-orders.ejs', {
          accountName: req.session.user?.name ?? 'Usuario',
          orders: [],
          cart: req.session.cart,
          account: req.session.user,
          isLogged: req.session.isLogged,
          toast: toastDispatch(req),
          t: i18next.t,
        });
      else {
        const orders = results as (Order & CartProduct[])[];
        res.render('my-orders.ejs', {
          accountName: req.session.user?.name ?? 'Usuario',
          orders: orders,
          cart: req.session.cart,
          account: req.session.user,
          isLogged: req.session.isLogged,
          toast: toastDispatch(req),
          t: i18next.t,
        });
      }
    }
  );
};
