import { QueryError } from "mysql2";
import { databaseConnect } from "../../database";
import { Category, Product } from "../types";
import { Response } from "express";

export const renderShopHome = (res: Response) => {
  const connection = databaseConnect();

  const getCategoriesQuery = `SELECT * FROM categories;`;
  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) throw new Error(error.message);

      res.render("shop.ejs", {
        categories: categoryResults,
        products: undefined,
        currentCategory: "",
      });

      connection.end();
    }
  );
};

type CategoryPageProps = {
  res: Response;
  currentCategory: string;
  isOnlyOffers?: boolean;
  isSortedByPrice?: boolean;
  isSortedByName?: boolean;
};

export const renderCategoryPage = ({
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
      if (error) throw new Error(error.message);

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
        (error: QueryError, productResults: Partial<Product>[]) => {
          if (error) throw new Error(error.message);
          res.render("shop.ejs", {
            categories: categoryResults,
            products: productResults,
            currentCategory: currentCategory,
          });
        }
      );
    }
  );
};

type ProductPageProps = {
  res: Response;
  currentCategory: string;
  productId: string;
};

export const renderProductPage = ({
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
      });
    }
  );
};
