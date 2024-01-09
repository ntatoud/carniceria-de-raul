import { QueryError } from 'mysql2';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { Request, Response } from 'express';
import i18next from '@/lib/i18n/config.js';
import { toastDispatch, toastEmpty } from '@/components/toast/index.js';

export const CATEGORIES = ['Ternera', 'Pollo', 'Cerdo', 'Elaborado'];
export const getAllProductsWithCategory = (
  req: Request,
  res: Response
  //filter?: string
) => {
  const connection = databaseConnect();
  const getProductsQuery = 'SELECT * FROM products;';

  connection.query(
    getProductsQuery,
    (error: QueryError, productResults: Product[]) => {
      if (error)
        res.status(502).render('shop.ejs', {
          error: { state: true, message: error.message },
          categories: CATEGORIES,
          products: undefined,
          currentCategory: '',
          isLogged: req.session.isLogged,
          account: req.session.user,
          toast: toastEmpty(),
          cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
          t: i18next.t,
        });
      const products: Product[] = productResults.map((product: Product) => {
        const { category, ...rest } = product;
        return {
          category: category.toLowerCase(),
          ...rest,
        };
      });
      res.status(200).render('shop.ejs', {
        error: { state: false, message: '' },
        categories: CATEGORIES,
        products: products,
        currentCategory: '',
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
        t: i18next.t,
      });

      databaseDisconnect(connection);
    }
  );
};

type CategoryPageProps = {
  req: Request;
  res: Response;
  currentCategory: string;
  isOnlyOffers?: boolean;
  isSortedByPrice?: boolean;
  isSortedByName?: boolean;
};

export const renderCategoryPage = ({
  req,
  res,
  currentCategory,
  isOnlyOffers = false,
  isSortedByPrice = false,
  isSortedByName = false,
}: CategoryPageProps) => {
  const connection = databaseConnect();

  const getProductsFromCategoryQuery = `SELECT products.* FROM products\
        WHERE category = "${currentCategory}"
        ${isOnlyOffers ? 'AND products.sale = 1' : ''}
        ${
          isSortedByPrice && !isSortedByName
            ? 'ORDER BY products.price ASC'
            : ''
        }
        ${
          isSortedByName && !isSortedByPrice ? 'ORDER BY products.name ASC' : ''
        };`;

  connection.query(
    getProductsFromCategoryQuery,
    (error: QueryError, productResults: Omit<Product, 'category'>[]) => {
      if (error)
        res.render('shop.ejs', {
          error: { state: false, message: error.message },
          categories: CATEGORIES,
          products: undefined,
          currentCategory: currentCategory,
          isLogged: req.session.isLogged,
          account: req.session.user,
          toast: toastDispatch(req),
          cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
          t: i18next.t,
        });

      const products: Product[] = productResults.map((product) => {
        return {
          category: currentCategory.toLowerCase(),
          ...product,
        };
      });

      res.render('shop.ejs', {
        error: { state: false, message: '' },
        categories: CATEGORIES,
        products: products,
        currentCategory: currentCategory,
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
        t: i18next.t,
      });

      databaseDisconnect(connection);
    }
  );
};

type ProductPageProps = {
  req: Request;
  res: Response;
  currentCategory: string;
  productId: string;
};

export const renderProductPage = ({
  req,
  res,
  currentCategory,
  productId,
}: ProductPageProps) => {
  const connection = databaseConnect();

  connection.query(
    `SELECT * from products WHERE productId = ${productId};`,
    (error: QueryError, results: Partial<Product>[]) => {
      if (error) databaseError(error);
      res.render('product.ejs', {
        product: results[0],
        currentCategory: currentCategory,
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
        t: i18next.t,
      });

      databaseDisconnect(connection);
    }
  );
};
