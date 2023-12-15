import { databaseConnect } from '../../../database';
import { UserSession } from '@/features/types';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

export const getCartQuery =
  'SELECT p.*, ucp.totalQuantity, ucp.weight, c.name as category\
    FROM users_cart_products ucp\
    JOIN products p ON ucp.productId = p.productId\
    JOIN product_categories pc ON ucp.productId = pc.productId\
    JOIN categories c ON pc.categoryId = c.categoryId\
    WHERE ucp.userId = ?;';

export const setCartProductsTotalPrices = (cart: Cart) => {
  cart.map((cartProduct) => {
    cartProduct.totalPrice =
      cartProduct.unit == '€/kg'
        ? (cartProduct.price * cartProduct.totalQuantity * cartProduct.weight) /
          1000
        : cartProduct.price * cartProduct.totalQuantity;

    if (!!cartProduct.sale && cartProduct.salePrice)
      cartProduct.totalSalePrice =
        cartProduct.unit == '€/kg'
          ? (cartProduct.salePrice *
              cartProduct.totalQuantity *
              cartProduct.weight) /
            1000
          : cartProduct.price * cartProduct.totalQuantity;
  });
};

export const cartTotalPrice = (
  cart: Cart | undefined,
  withSales?: boolean
): number | undefined => {
  if (!cart) return;
  return cart.reduce(
    (acc, cartProduct) =>
      acc +
      (withSales
        ? cartProduct.totalSalePrice ?? cartProduct.totalPrice
        : cartProduct.totalPrice ?? 0),
    0
  );
};

export const renderCart = (req: Request, res: Response) => {
  res.render('cart.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.cart,
    totalPrice: cartTotalPrice(req.session.cart),
    totalSalePrice: cartTotalPrice(req.session.cart, true),
  });
};

export const cartProductDelete = (
  session: UserSession,
  productId: number,
  weight: number,
  res: Response
) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users_cart_products WHERE userId = ? AND productId = ? AND weight = ?;`;
  connection.query(
    deleteQuery,
    [session.user?.userId, +productId, +weight],
    (error: QueryError | null) => {
      if (error) throw new Error(error.message);

      sendNewCart(connection, session, res);
    }
  );
};

export const cartProductUpdate = (
  session: UserSession,
  productId: number,
  weight: number,
  quantityToAdd: number,
  res: Response
) => {
  const currentProduct = () =>
    session.cart?.find(
      (cartProduct) =>
        cartProduct.productId === productId && cartProduct.weight === weight
    );
  const currentQuantity = currentProduct()?.totalQuantity;

  const userId = session.user?.userId;
  const newTotalQuantity = currentQuantity
    ? currentQuantity + quantityToAdd
    : quantityToAdd;
  const addToCartQuery =
    'REPLACE INTO users_cart_products (userId, productId, totalQuantity, weight) VALUES (?, ?, ?, ?);';

  const connection = databaseConnect();
  connection.execute(
    addToCartQuery,
    [userId, productId, newTotalQuantity, weight],
    (error: QueryError | null) => {
      if (error) throw new Error(error.message);

      sendNewCart(connection, session, res, currentProduct);
    }
  );
};

const sendNewCart = (
  connection: Connection,
  session: UserSession,
  res: Response,
  currentProduct?: () => CartProduct | undefined
) => {
  const getNewCartQuery = getCartQuery;

  connection.execute(
    getNewCartQuery,
    [session.user?.userId],
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) throw new Error(error.message);
      session.cart = results as Cart;
      setCartProductsTotalPrices(session.cart);
      if (currentProduct) {
        res.status(200).send({
          newCartSize: session.cart.length,
          newProductTotalPrice: currentProduct()?.totalPrice,
          newProductTotalSalePrice: currentProduct()?.totalSalePrice,
          newCartTotalPrice: cartTotalPrice(session.cart),
          newCartTotalSalePrice: cartTotalPrice(session.cart, true),
        });
      } else {
        res.status(200).send({
          newCartSize: session.cart.length,
          newCartTotalPrice: cartTotalPrice(session.cart),
          newCartTotalSalePrice: cartTotalPrice(session.cart, true),
        });
      }

      connection.end();
    }
  );
};
