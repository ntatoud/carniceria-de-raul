import { Response } from 'express';
import { toastSuccess } from '../../../components/toast';
import { UserSession } from '@/features/types';
import { databaseConnect } from '../../../database';
import { QueryError, RowDataPacket } from 'mysql2';
import {
  getCartQuery,
  setCartProductsTotalPrices,
} from '../../order/cart/utils';
export const createSession = (
  res: Response,
  session: UserSession,
  userData: Account
) => {
  const getUserCartQuery = getCartQuery;
  const connection = databaseConnect();

  connection.execute(
    getUserCartQuery,
    [userData.userId],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) throw new Error(error.message);
      session.user = { ...userData };
      session.cart = results as Cart;
      setCartProductsTotalPrices(session.cart);
      session.isLogged = true;
      session.toast = toastSuccess({ content: 'You are now connected' });
      res.status(200).redirect('/');
    }
  );
};
