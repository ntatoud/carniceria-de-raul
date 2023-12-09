import { QueryError } from "mysql2";
import { databaseConnect } from "../../database";
import { Category, Product } from "../types";
import { Request, Response } from "express";

export const getAllProductsWithCategory = (res: Response, filter?: string) => {
  const connection = databaseConnect();
  const getProductsQuery =
    "SELECT p.*, c.name AS category FROM products p JOIN product_categories pc ON p.product_id = pc.product_id JOIN categories c ON pc.category_id = c.category_id;";

  const getCategoriesQuery = `SELECT * FROM categories;`;

  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) res.status(404).render("404.ejs");

      connection.query(
        getProductsQuery,
        (error: QueryError, productResults: Product[]) => {
          if (error)
            res.status(502).render("shop.ejs", {
              error: { state: true, message: error.message },
              categories: categoryResults,
              products: undefined,
              currentCategory: "",
            });

          const products: Product[] = productResults.map((product: Product) => {
            const { category, ...rest } = product;
            return { category: category.toLowerCase(), ...rest };
          });
          res.status(200).render("shop.ejs", {
            error: { state: false, message: "" },
            categories: categoryResults,
            products: products,
            currentCategory: "",
          });
          connection.end();
        }
      );
    }
  );
};

export const renderShopHome = (req: Request, res: Response) => {
  const connection = databaseConnect();

  const getCategoriesQuery = `SELECT * FROM categories;`;
  const getSalesProduct = "SELECT * from products where sale = 1;";
  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) res.status(404).render("404.ejs");

      connection.query(
        getSalesProduct,
        (error: QueryError, productResults: Product[]) => {
          if (error)
            res.status(502).render("shop.ejs", {
              error: { state: true, message: error.message },
              categories: categoryResults,
              products: undefined,
              currentCategory: "",
            });
        }
      );
      res.render("shop.ejs", {
        error: { state: false, message: "" },
        categories: categoryResults,
        products: undefined,
        currentCategory: "",
        isLogged: req.session.isLogged,
      });

      connection.end();
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
      if (error) res.status(404).render("404.ejs");

      const getProductsFromCategoryQuery = `SELECT products.* FROM products
        JOIN product_categories ON products.product_id = product_categories.product_id
        JOIN categories ON product_categories.category_id = categories.category_id
        WHERE categories.name = "${currentCategory}"
        ${isOnlyOffers ? "AND products.sale = 1" : ""}
        ${
          isSortedByPrice && !isSortedByName
            ? "ORDER BY products.price ASC"
            : ""
        }
        ${
          isSortedByName && !isSortedByPrice ? "ORDER BY products.name ASC" : ""
        };`;

      connection.query(
        getProductsFromCategoryQuery,
        (error: QueryError, productResults: Omit<Product, "category">[]) => {
          if (error)
            res.render("shop.ejs", {
              error: { state: false, message: error.message },
              categories: categoryResults,
              products: undefined,
              currentCategory: currentCategory,
              isLogged: req.session.isLogged,
            });

          const products: Product[] = productResults.map((product) => {
            return { category: currentCategory.toLowerCase(), ...product };
          });

          res.render("shop.ejs", {
            error: { state: false, message: "" },
            categories: categoryResults,
            products: products,
            currentCategory: currentCategory,
            isLogged: req.session.isLogged,
          });

          connection.end();
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
    `SELECT * from products WHERE product_id = ${productId};`,
    (error: QueryError, results: Partial<Product>[]) => {
      if (error) throw new Error(error.message);
      res.render("product.ejs", {
        product: results[0],
        currentCategory: currentCategory,
        isLogged: req.session.isLogged,
      });
    }
  );
};
