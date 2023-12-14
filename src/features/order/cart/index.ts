import { QueryError, RowDataPacket } from 'mysql2';
import { databaseConnect } from '../../../database';
import { Request, Response, Router, urlencoded } from 'express';
import { toastDispatch, toastSuccess } from '../../../components/toast';

const router = Router();

router.use(urlencoded({ extended: true }));

router.put('/', (req: Request, res: Response) => {
  const quantityToAdd = +req.body.quantity;
  const weight = +req.body.weight;
  const productId = +req.body.productId;
  const currentQuantity = req.session.cart?.find(
    (cartProduct) =>
      cartProduct.productId === productId && cartProduct.weight === weight
  )?.totalQuantity;

  const userId = req.session.user?.userId;
  const newTotalQuantity = currentQuantity
    ? currentQuantity + quantityToAdd
    : quantityToAdd;
  const addToCartQuery =
    'REPLACE INTO users_cart_products (userId, productId, totalQuantity, weight) VALUES (?, ?, ?, ?);';

  const getNewCartQuery =
    'SELECT p.productId, p.name, p.price, p.unit, ucp.totalQuantity, ucp.weight\
      FROM users_cart_products ucp\
      JOIN products p ON ucp.productId = p.productId\
      WHERE ucp.userId = ?;';
  const connection = databaseConnect();
  connection.execute(
    addToCartQuery,
    [req.session.user?.userId, productId, newTotalQuantity, weight],
    (error: QueryError | null) => {
      if (error) throw new Error(error.message);

      connection.execute(
        getNewCartQuery,
        [userId],
        (error: QueryError | null, results: RowDataPacket[]) => {
          if (error) throw new Error(error.message);
          req.session.cart = results as Cart;
          res.sendStatus(200);
        }
      );
    }
  );
});

router.delete('/', (req: Request, res: Response) => {
  const connection = databaseConnect();
  const [productId, weight] = req.body.id.split('-');
  const deleteQuery = `DELETE FROM users_cart_products WHERE userId = ? AND productId = ? AND weight = ?;`;
  connection.query(
    deleteQuery,
    [req.session.user?.userId, +productId, +weight],
    (error: QueryError | null) => {
      if (error) throw new Error(error.message);
      const getNewCartQuery =
        'SELECT p.productId, p.name, p.price, p.unit, ucp.totalQuantity, ucp.weight\
        FROM users_cart_products ucp\
        JOIN products p ON ucp.productId = p.productId\
        WHERE ucp.userId = ?;';
      connection.execute(
        getNewCartQuery,
        [req.session.user?.userId],
        (error: QueryError | null, results: RowDataPacket[]) => {
          if (error) throw new Error(error.message);
          req.session.cart = results as Cart;
          req.session.toast = toastSuccess({
            content: 'Product removed from cart',
          });
          res.sendStatus(200);
        }
      );
    }
  );
});

router.use('/', (req: Request, res: Response) => {
  res.render('cart.ejs', {
    isLogged: req.session.isLogged,
    account: req.session.user,
    products: req.session.cart,
    toast: toastDispatch(req),
  });
});

export default router;
