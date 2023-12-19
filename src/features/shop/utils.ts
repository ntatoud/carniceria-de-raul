import { QueryError } from 'mysql2';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { Category } from '@/features/types.js';
import { Request, Response } from 'express';
import { toastDispatch, toastEmpty } from '@/components/toast/index.js';

export const getAllProductsWithCategory = (
  req: Request,
  res: Response
  //filter?: string
) => {
  const connection = databaseConnect();
  const getProductsQuery =
    'SELECT p.*, c.name AS category FROM products p JOIN product_categories pc ON p.productId = pc.productId JOIN categories c ON pc.categoryId = c.categoryId;';

  const getCategoriesQuery = `SELECT * FROM categories;`;

  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) res.status(404).render('404.ejs');

      connection.query(
        getProductsQuery,
        (error: QueryError, productResults: Product[]) => {
          if (error)
            res.status(502).render('shop.ejs', {
              error: { state: true, message: error.message },
              categories: categoryResults,
              products: undefined,
              currentCategory: '',
              isLogged: req.session.isLogged,
              account: req.session.user,
              toast: toastEmpty(),
              cart: req.session.cart,
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
            categories: categoryResults,
            products: products,
            currentCategory: '',
            isLogged: req.session.isLogged,
            account: req.session.user,
            toast: toastDispatch(req),
            cart: req.session.cart,
          });

          databaseDisconnect(connection);
        }
      );
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

  const getCategoriesQuery = `SELECT * FROM categories;`;
  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) res.status(404).render('404.ejs');

      const getProductsFromCategoryQuery = `SELECT products.* FROM products
        JOIN product_categories ON products.productId = product_categories.productId
        JOIN categories ON product_categories.categoryId = categories.categoryId
        WHERE categories.name = "${currentCategory}"
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
              categories: categoryResults,
              products: undefined,
              currentCategory: currentCategory,
              isLogged: req.session.isLogged,
              account: req.session.user,
              toast: toastDispatch(req),
              cart: req.session.cart,
            });

          const products: Product[] = productResults.map((product) => {
            return {
              category: currentCategory.toLowerCase(),
              ...product,
            };
          });

          res.render('shop.ejs', {
            error: { state: false, message: '' },
            categories: categoryResults,
            products: products,
            currentCategory: currentCategory,
            isLogged: req.session.isLogged,
            account: req.session.user,
            toast: toastDispatch(req),
            cart: req.session.cart,
          });

          databaseDisconnect(connection);
        }
      );
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
        cart: req.session.cart,
      });

      databaseDisconnect(connection);
    }
  );
};
