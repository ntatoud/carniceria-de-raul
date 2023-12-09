import { databaseConnect } from "../../../database";
import { Product } from "@/features/types";
import { Request, Response } from "express";
import { QueryError, RowDataPacket } from "mysql2";

export const productCreate = (res: Response, product: Partial<Product>) => {
  const connection = databaseConnect();
  const queryParams = [
    product.name,
    product.price,
    product.stock,
    product.sale,
    product.salePrice ?? null,
    product.image ?? "",
    product.description,
  ];
  const createProductQuery =
    "INSERT INTO products (name, price, stock, sale, sale_price, image, description) VALUES (?, ?, ?, ?, ?, ?, ?);";

  connection.query(
    createProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) {
        throw new Error(error.message);
      } else {
        res.redirect(302, "/admin/products");
      }
    }
  );
};

export const productUpdate = (res: Response, product: Product, id: string) => {
  const connection = databaseConnect();
  const queryParams = [
    product.name,
    product.price,
    product.stock,
    product.sale,
    product.salePrice ?? null,
    product.image ?? "",
    product.description,
    id,
  ];

  const updateProductQuery =
    "UPDATE products SET name = ?, price = ?, stock = ?, sale = ?, sale_price = ?, image = ?, description = ? WHERE product_id = ?;";
  connection.query(
    updateProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) throw new Error(error.message);
      else {
        res.redirect("/admin/products");
      }
    }
  );
};

export const getProductToUpdate = (
  req: Request,
  res: Response,
  productId: string
) => {
  const connection = databaseConnect();
  // To use once merged in main !
  // const getProductQuery =
  //   "SELECT p.product_id, p.name p.price, p.stock, p.sale, p.sale_price, p.image, p.description, c.name AS category FROM products p JOIN product_category pc ON p.product_id = pc.product_id JOIN category c ON pc.category_id = c.id;";
  const getProductQuery = "SELECT * FROM products WHERE product_id = ?;";

  connection.query(
    getProductQuery,
    [productId],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) throw new Error(error.message);

      const product = result[0] as Product;

      res.render("productUpdate.ejs", {
        product: product,
        isLogged: req.session.isLogged,
      });
    }
  );
};

export const productDelete = (res: Response, productId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM products WHERE product_id = ?;`;
  connection.query(deleteQuery, [productId], (error: QueryError | null) => {
    if (error) throw new Error(error.message);

    res.status(200).send("OK");
  });
};

export const getProductList = (
  req: Request,
  res: Response,
  category?: string
) => {
  const connection = databaseConnect();
  const getProductsQuery = "SELECT * from products;";

  connection.query(
    getProductsQuery,
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) throw new Error(error.message);

      res.render("products.ejs", {
        products: results as Product[],
        isLogged: req.session.isLogged,
      });
    }
  );
};

export const addCategory = (res: Response) => {};
