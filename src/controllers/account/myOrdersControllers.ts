import { toastDispatch } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { generateBillPDF } from '@/lib/pdfkit/config.js';
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

export const generateBillPDFFromOrderId = (
  req: Request,
  res: Response,
  id: string
) => {
  const getOrderAndProduct = `SELECT \
    o.orderId, \
    o.userId, \
    o.email,
    po.quantity as totalQuantity, \
    po.weight,
    o.orderDate, \
    o.recoveryDate, \
    o.totalPrice, \
    o.comment, \
    p.productId,
    p.name,
    p.price,
    p.sale,
    p.salePrice,
    p.unit
    FROM \
    orders o \
    JOIN products_orders po ON o.orderId = po.orderId \
    JOIN products p ON po.productId = p.productId \
    JOIN users u ON o.userId = u.userId
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
        generateBillPDF(req, res, results as (Order & CartProduct)[]);
      }

      databaseDisconnect(connection);
    }
  );
};
