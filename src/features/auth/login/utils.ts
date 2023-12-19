import { Response } from 'express';
import { toastSuccess } from '@/components/toast/index.js';
import { UserSession } from '@/features/types.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { QueryError, RowDataPacket } from 'mysql2';
import {
  getCartQuery,
  setCartProductsTotalPrices,
} from '@/features/order/cart/utils.js';
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
      if (error) databaseError(error);
      session.user = { ...userData };
      session.cart = results as Cart;
      setCartProductsTotalPrices(session.cart);
      session.isLogged = true;
      session.toast = toastSuccess({ content: 'You are now connected' });
      res.status(200).redirect('/');

      databaseDisconnect(connection);
    }
  );
};
