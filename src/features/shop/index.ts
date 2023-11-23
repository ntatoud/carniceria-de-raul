import { Router, Response, Request } from "express";
import { databaseConnect } from "../../database";
import { QueryError } from "mysql2";
import { Category, Product } from "../types";
const router = Router();

const getCategoryNameFromUrl = (url: string): string => {
  if (url.length < 2) return "";
  const categoryName = url.slice(1);
  return categoryName[0].toUpperCase() + categoryName.slice(1);
};

router.use("/", (req: Request, res: Response) => {
  const currentCategory = getCategoryNameFromUrl(req.url);

  const connection = databaseConnect();
  const getCategoriesQuery = `SELECT * FROM categories;`;
  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) throw new Error(error.message);
      if (currentCategory) {
        const getProductsFromCategoryQuery = `SELECT products.* FROM products
      JOIN product_categories ON products.product_id = product_categories.product_id
      JOIN categories ON product_categories.category_id = categories.category_id
      WHERE categories.name = "${currentCategory}";`;

        connection.query(
          getProductsFromCategoryQuery,
          (error: QueryError, productResults: Partial<Product>[]) => {
            if (error) throw new Error(error.message);
            res.render("shop.ejs", {
              categories: categoryResults,
              products: productResults,
            });
          }
        );
      } else
        res.render("shop.ejs", {
          categories: categoryResults,
          products: undefined,
        });

      connection.end();
    }
  );
});

export default router;
