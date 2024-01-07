import { Response, Request } from 'express';
import { toastSuccess } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { QueryError, RowDataPacket } from 'mysql2';
import {
  getCartQuery,
  setCartProductsTotalPrices,
} from '@/controllers/order/cartController.js';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';
export const createSession = (
  req: Request,
  res: Response,
  userData: Account
) => {
  const getUserCartQuery = getCartQuery;
  const connection = databaseConnect();
  if (req.cookies.cart?.length) {
    createSessionFromExistingCart(
      req,
      res,
      connection,
      getUserCartQuery,
      userData
    );
  } else {
    createSessionFromEmptyCart(
      req,
      res,
      connection,
      getUserCartQuery,
      userData
    );
  }
};

const createSessionFromExistingCart = (
  req: Request,
  res: Response,
  connection: Connection,
  getCartQuery: string,
  userData: Account
) => {
  const addToCartQuery = `REPLACE INTO users_cart_products (userId, productId, totalQuantity, weight) VALUES ${' (?, ?, ?, ?),'
    .repeat(req.cookies.cart.length)
    .slice(0, -1)};`;
  const productQueryParams = (req.cookies.cart as Cart).reduce(
    (acc: number[], cartProduct: CartProduct) => {
      acc.push(
        userData.userId,
        cartProduct.productId,
        cartProduct.totalQuantity,
        cartProduct.weight
      );
      return acc;
    },
    []
  );
  connection.execute(
    addToCartQuery,
    [...productQueryParams],
    (error: QueryError | null) => {
      if (error) databaseError(error);
      res.cookie('cart', [] as Cart);
      createSessionFromEmptyCart(req, res, connection, getCartQuery, userData);
    }
  );
};

const createSessionFromEmptyCart = (
  req: Request,
  res: Response,
  connection: Connection,
  getCartQuery: string,
  userData: Account
) => {
  connection.execute(
    getCartQuery,
    [userData.userId],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) databaseError(error);
      req.session.user = { ...userData };
      req.session.cart = results as Cart;
      setCartProductsTotalPrices(req.session.cart);
      req.session.isLogged = true;
      req.session.toast = toastSuccess({
        content: 'You are now connected',
      });
      res.status(200).redirect('/');

      databaseDisconnect(connection);
    }
  );
};
