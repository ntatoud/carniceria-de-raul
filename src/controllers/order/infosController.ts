import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { Order, User, UserSession } from '@/types/types.js';
import { Response } from 'express';
import { cartTotalPrice } from '@/controllers/order/cartController.js';
import { QueryError } from 'mysql2';

export const saveOrder = (
  session: UserSession,
  res: Response,
  orderDetails: Partial<User> &
    Order & { recoveryDay: string; recoveryTime: string },
  userId: number
) => {
  const {
    city,
    postalCode,
    country,
    address,
    phone,
    recoveryDay,
    recoveryTime,
    comment,
    email,
  } = orderDetails;
  const connection = databaseConnect();
  const recoveryDate = new Date(`${recoveryDay} ${recoveryTime}`);
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
    [city, postalCode, country, address, phone, userId],
    (error: QueryError | null) => {
      if (error) {
        databaseError(error, 'POST /order/infos on users');
        res.status(500).send('Error updating user data.');
      } else {
        const updateOrderQuery = `
          INSERT INTO orders (userId, recoveryDate, comment, email, totalPrice)
          VALUES (?, ?, ?, ?, ?);`;

        connection.query(
          updateOrderQuery,
          [
            userId,
            recoveryDate,
            comment ?? 'No comments',
            email,
            cartTotalPrice(session.cart, true),
          ],
          (error: QueryError | null) => {
            if (error) {
              databaseError(error, 'POST /order/infos on orders');
              res.status(500).send('Error updating order data.');
            }
            res.sendStatus(200);

            databaseDisconnect(connection);
          }
        );
      }
    }
  );
};
