import { databaseConnect } from "../../../database";
import { Order } from "@/features/types";
import { Request, Response } from "express";
import { QueryError, RowDataPacket } from "mysql2";

export const getOrderFromId = (req: Request, res: Response, id: string) => {
  const getOrderAndProduct = `SELECT \
    o.order_id, \
    o.user_id, \
    po.quantite, \
    o.order_date, \
    o.recovery_date, \
    o.total_price, \
    o.comment, \
    pc.product_id, \
    p.name AS product_name, \
    p.price AS product_price, \
    p.unit AS product_unit, \
    p.stock AS product_stock, \
    p.sale AS product_sale, \
    p.sale_price AS product_sale_price, \
    p.best AS product_best, \
    p.image AS product_image, \
    p.description AS product_description, \
    c.category_id, \
    c.name AS category_name \
    FROM \
    orders o \
    JOIN products_orders po ON o.order_id = po.order_id \
    JOIN products p ON po.product_id = p.product_id \
    JOIN product_categories pc ON p.product_id = pc.product_id \
    JOIN categories c ON pc.category_id = c.category_id \
    WHERE \
    o.order_id = ${id};`;

  const connection = databaseConnect();

  connection.query(
    getOrderAndProduct,
    [id],
    (error: QueryError | null, results: any) => {
      if (error) {
        throw new Error(error.message);
      } else {
        console.log(results);
        res.render("orderDetails.ejs", {
          orderProducts: results,
          isLogged: req.session.isLogged,
          sessionUser: req.session.user,
        });
      }
    }
  );
};

export const getOrderList = (req: Request, res: Response) => {
  const connection = databaseConnect();

  const getOrderQuery =
    "SELECT \
    o.order_id, \
    o.user_id, \
    u.email AS user_email, \
    u.name AS user_name, \
    u.surname AS user_surname, \
    o.order_date, \
    o.recovery_date, \
    o.total_price \
    FROM \
    orders o \
    JOIN users u ON o.user_id = u.user_id;";
  connection.query(
    getOrderQuery,
    (error: QueryError, results: RowDataPacket[]) => {
      if (error) {
        throw new Error(error.message);
      } else {
        console.log(results);
        res.render("orders.ejs", {
          orders: results,
          isLogged: req.session.isLogged,
          sessionUser: req.session.user,
        });
      }
    }
  );
};

export const orderDelete = (res: Response, userId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users WHERE user_id = ?;`;
  connection.query(deleteQuery, [userId], (error: QueryError | null) => {
    if (error) throw new Error(error.message);

    res.status(200).send("OK");
  });
};
