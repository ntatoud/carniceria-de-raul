import { Router, urlencoded, Request, Response } from "express";
import { databaseConnect } from "../../../database";
import { User } from "../../types";
import { QueryError } from "mysql2";
import { getUserToUpdate, userCreate, userUpdate } from "./utils";
const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/create", (req: Request, res: Response) => {
  userCreate(res, req.body);
});

router.post("/update/:id", (req: Request, res: Response) => {
  console.log(req.params.id, req.body);
  userUpdate(res, req.body, req.params.id);
});

router.use("/create", (req: Request, res: Response) => {
  res.render("userCreate.ejs", { user: undefined });
});

router.use("/update/:id", (req: Request, res: Response) => {
  getUserToUpdate(res, req.params.id);
});

router.use("/", (req: Request, res: Response) => {
  const connection = databaseConnect();
  connection.query(
    "SELECT name, surname, email, user_id, authorities FROM users;",
    (error: QueryError, results: Partial<User>[]) => {
      if (error) {
        res.send("404");
        throw new Error(error.message);
      }
      res.render("users.ejs", { users: results });
    }
  );
});

export default router;
