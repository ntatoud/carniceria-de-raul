import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { UserSession } from '@/types/types.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { Connection } from 'mysql2/typings/mysql/lib/Connection';

export const getCartQuery =
  'SELECT p.*, ucp.totalQuantity, ucp.weight\
    FROM users_cart_products ucp\
    JOIN products p ON ucp.productId = p.productId\
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
  if (req.session.isLogged) {
    res.render('cart.ejs', {
      isLogged: true,
      account: req.session.user,
      cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
      totalPrice: cartTotalPrice(req.session.cart),
      totalSalePrice: cartTotalPrice(req.session.cart, true),
    });
  } else {
    res.render('cart.ejs', {
      isLogged: false,
      account: '',
      cart: req.cookies.cart,
      totalPrice: cartTotalPrice(req.cookies.cart),
      totalSalePrice: cartTotalPrice(req.cookies.cart, true),
    });
  }
};

export const cartProductDelete = (
  req: Request,
  res: Response,
  productId: number,
  weight: number
) => {
  if (req.session.isLogged) {
    const connection = databaseConnect();
    const deleteQuery = `DELETE FROM users_cart_products WHERE userId = ? AND productId = ? AND weight = ?;`;
    connection.query(
      deleteQuery,
      [req.session.user?.userId, +productId, +weight],
      (error: QueryError | null) => {
        if (error) databaseError(error);

        sendNewCart(connection, req.session, res);
      }
    );
  } else {
    req.cookies.cart = (req.cookies.cart as Cart)?.filter(
      (cartProduct) =>
        !(cartProduct.productId === productId && cartProduct.weight === weight)
    );

    res.cookie('cart', req.cookies.cart as Cart);
    res.status(200).send({
      newCartSize: req.cookies.cart.length,
      newCartTotalPrice: cartTotalPrice(req.cookies.cart),
      newCartTotalSalePrice: cartTotalPrice(req.cookies.cart, true),
    });
  }
};

export const cartProductUpdate = (
  req: Request,
  res: Response,
  productId: number,
  weight: number,
  quantityToAdd: number
) => {
  if (req.session.isLogged) {
    const currentProduct = () =>
      req.session.cart?.find(
        (cartProduct) =>
          cartProduct.productId === productId && cartProduct.weight === weight
      );
    const currentQuantity = currentProduct()?.totalQuantity;
    const userId = req.session.user?.userId;
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
        if (error) databaseError(error);

        sendNewCart(connection, req.session, res, currentProduct);
      }
    );
  } else if (req.cookies.cart) {
    cookieCartUpdate(req, res, productId, weight, quantityToAdd);
  } else {
    res.status(400).send('NOK');
  }
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
      if (error) databaseError(error);
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

      databaseDisconnect(connection);
    }
  );
};

const cookieCartUpdate = (
  req: Request,
  res: Response,
  productId: number,
  weight: number,
  quantityToAdd: number
) => {
  const currentProduct = () =>
    (req.cookies.cart as Cart)?.find(
      (cartProduct) =>
        cartProduct.productId === productId && cartProduct.weight === weight
    );

  if (!currentProduct()) {
    const connection = databaseConnect();
    connection.execute(
      'SELECT * from products\
      WHERE productId = ?;',
      [productId],
      (error: QueryError | null, results: RowDataPacket[]) => {
        if (error) {
          databaseError(error, 'POST /order/cart not auth');
          res.status(400).send('Product not found');
        } else {
          const product = results[0] as Product;

          const cartProduct = !product.sale
            ? ({
                totalQuantity: quantityToAdd,
                totalPrice:
                  product.unit === '€/kg'
                    ? (product.price * quantityToAdd * weight) / 1000
                    : product.price * quantityToAdd,
                weight: weight,
                ...product,
              } as CartProduct)
            : ({
                totalQuantity: quantityToAdd,
                totalPrice:
                  product.unit === '€/kg'
                    ? (product.price * quantityToAdd * weight) / 1000
                    : product.price * quantityToAdd,
                totalSalePrice:
                  product.unit === '€/kg'
                    ? (product.salePrice! * quantityToAdd * weight) / 1000
                    : product.salePrice! * quantityToAdd,
                weight: weight,
                ...product,
              } as CartProduct);

          (req.cookies.cart as Cart)?.push(cartProduct);

          res.cookie('cart', req.cookies.cart as Cart);
          res.status(200).send({
            newCartSize: req.cookies.cart?.length ?? '0',
            newCartTotalPrice: cartTotalPrice(req.cookies.cart),
            newCartTotalSalePrice: cartTotalPrice(req.cookies.cart, true),
          });
        }
      }
    );
  } else {
    currentProduct()!.totalQuantity =
      currentProduct()!.totalQuantity + quantityToAdd;

    setCartProductsTotalPrices(req.cookies.cart);

    res.cookie('cart', req.cookies.cart as Cart);

    res.status(200).send({
      newCartSize: req.cookies.cart.length,
      newProductTotalPrice: currentProduct()?.totalPrice,
      newProductTotalSalePrice: currentProduct()?.totalSalePrice,
      newCartTotalPrice: cartTotalPrice(req.cookies.cart),
      newCartTotalSalePrice: cartTotalPrice(req.cookies.cart, true),
    });
  }
};
