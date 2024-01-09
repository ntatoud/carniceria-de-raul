import { toastSuccess } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import stripe from '@/lib/stripe/config.js';
import { Request, Response } from 'express';
import { Connection, QueryError, RowDataPacket } from 'mysql2';
import i18next from '@/lib/i18n/config.js';

export const createOrderFromSession = (
  req: Request,
  res: Response,
  amount: number
) => {
  const connection = databaseConnect();
  const { user, order, cart } = req.session;

  const updateUserQuery = `
      UPDATE users
      SET city = ?,
          postalCode = ?,
          country = ?,
          address = ?,
          phone = ?
      WHERE userId = ?;`;

  connection.query(
    updateUserQuery,
    [
      user?.city,
      user?.postalCode,
      user?.country,
      user?.address,
      user?.phone,
      user?.userId,
    ],
    (error: QueryError | null) => {
      if (error) {
        databaseError(error, 'POST /order/infos on users');
        res.status(500).send('Error updating user data.');
      } else {
        const orderCreateQuery =
          'INSERT INTO orders (userId, email, recoveryDate, totalPrice, comment, isDone)\
    VALUES(?, ?, ?, ?, ?, ?);';
        const queryParams = [
          user?.userId,
          order?.email,
          order?.recoveryDate,
          order?.totalPrice,
          order?.comment,
          order?.isDone,
        ];
        connection.execute(
          orderCreateQuery,
          queryParams,
          (error: QueryError | null) => {
            if (error) databaseError(error, '/payment/pay');
            else {
              console.log(order);
              connection.execute(
                'SELECT orderId from orders WHERE userId = ? AND recoveryDate = ?',
                [order?.userId, order?.recoveryDate],
                (error: QueryError | null, result: RowDataPacket[]) => {
                  if (error) {
                    databaseError(error);
                    res.sendStatus(400);
                  } else {
                    console.log(result);
                    const orderId = +String(result[0]?.orderId);
                    console.log(orderId);
                    const insertOrderProducts = `INSERT INTO products_orders (orderId, productId, quantity, weight) VALUES ${' (?, ?, ?, ?),'
                      .repeat(cart!.length)
                      .slice(0, -1)};`;
                    const insertQueryParams = cart!.reduce(
                      (acc: number[], cartProduct: CartProduct) => {
                        acc.push(
                          orderId,
                          cartProduct.productId,
                          cartProduct.totalQuantity,
                          cartProduct.weight
                        );
                        return acc;
                      },
                      []
                    );
                    connection.execute(
                      insertOrderProducts,
                      insertQueryParams,
                      (error: QueryError | null) => {
                        if (error) databaseError(error);
                        else {
                          handlePayment(req, res, amount, connection);
                        }
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

const handlePayment = async (
  req: Request,
  res: Response,
  amount: number,
  connection: Connection
) => {
  try {
    stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      description: 'Charge for' + req.session.user?.email,
    });
    cartDelete(req, res, connection);
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
};

const cartDelete = (req: Request, res: Response, connection: Connection) => {
  connection.execute(
    'DELETE FROM users_cart_products where userId= ?',
    [req.session.user?.userId],
    (error: QueryError | null) => {
      if (error) databaseError(error);
      else {
        req.session.cart = []; // Empty the cart

        req.session.toast = toastSuccess({
          content: i18next.t('main:toast.success.payment'),
        });
        res.redirect('/account/my-orders');
        databaseDisconnect(connection);
      }
    }
  );
};
