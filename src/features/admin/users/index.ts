import { Router, urlencoded, Request, Response } from "express";
import { databaseConnect } from "../../../database";
import { User } from "../../types";
const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  const connection = databaseConnect();
  connection.query(
    "SELECT name, email, authorities FROM users",
    (error: Error, results: Partial<User>[]) => {
      if (error) {
        res.send("404");
        throw new Error(error.message);
      }
      res.render("users.ejs", { users: results });
    }
  );
});

export default router;
