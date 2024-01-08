import { toastDispatch } from '@/components/toast/index.js';
import { databaseConnect, databaseError } from '@/database/index.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';

export const getOrdersByUserId = (
  req: Request,
  res: Response,
  userId: number
) => {
  const connection = databaseConnect();
  const getOrderAndProduct = `SELECT \
    o.orderId, \
    o.userId, \
    o.orderDate, \
    o.recoveryDate, \
    o.totalPrice, \
    o.comment \
    FROM \
    orders o \
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
        });
      }
    }
  );
};
