import { Response } from 'express';
import { toastSuccess } from '../../../components/toast';
import { UserSession } from '@/features/types';
import { databaseConnect } from '../../../database';
import { QueryError, RowDataPacket } from 'mysql2';
export const createSession = (
  res: Response,
  session: UserSession,
  userData: Account
) => {
  const getCartQuery =
    'SELECT p.name, p.price, ucp.quantity\
  FROM users_cart_products ucp\
  JOIN products p ON ucp.productId = p.productId\
  WHERE ucp.userId = ?;';
  const connection = databaseConnect();

  connection.execute(
    getCartQuery,
    [userData.userId],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) throw new Error(error.message);
      console.log(results);
      session.user = { ...userData };
      session.cart = results as Cart;
      session.isLogged = true;
      session.toast = toastSuccess({ content: 'You are now connected' });
      res.status(200).redirect('/');
    }
  );
};
