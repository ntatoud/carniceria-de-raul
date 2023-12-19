import { databaseConnect, databaseDisconnect } from '@/database/index.js';
import { Order, User, UserSession } from '@/features/types.js';
import { Response } from 'express';
import { cartTotalPrice } from '../cart/utils.js';
import { toastSuccess } from '@/components/toast/index.js';

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
    (error) => {
      if (error) {
        console.error('Error:', error);
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
            comment,
            email,
            cartTotalPrice(session.cart, true),
          ],
          (err) => {
            if (err) {
              console.error('Error:', err);
              res.status(500).send('Error updating order data.');
            }
            localStorage.setItem('toast', 'update');
            session.toast = toastSuccess({ content: 'Success' });

            res.send(200);

            databaseDisconnect(connection);
          }
        );
      }
    }
  );
};
