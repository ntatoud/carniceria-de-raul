import { Router, urlencoded, Request, Response } from "express";
import { databaseConnect } from "../../../database";
import { User } from "../../types";
import { QueryError } from "mysql2";
const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  const connection = databaseConnect();
  connection.query(
    "SELECT name, surname, email, user_id, authorities FROM users;",
    (error: QueryError, results: Partial<User>[]) => {
      if (error) {
        res.send("404");
        throw new Error(error.message);
      }
      console.log(results);
      res.render("users.ejs", { users: results });
    }

  );
});

export default router;
