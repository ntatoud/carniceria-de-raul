import { Router, urlencoded, Request, Response, query } from "express";
import { arePasswordEqual } from "../util";
import { databaseConnect } from "../../../database";
import { QueryError, RowDataPacket } from "mysql2/promise";
import { QueryResult, User } from "@/features/types";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const connection = databaseConnect(); // Establish database connection

  const selectQuery = `
      SELECT user_id, email, password, salt
      FROM users
      WHERE email = "${email}";
    `;

  connection.execute(
    selectQuery,
    [email],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error)
        res.status(502).render("login.ejs", {
          error: { state: true, message: error.message },
        });

      if (result.length) {
        const userData = (result as User[])[0];

        if (arePasswordEqual(password, userData)) {
          // Passwords match, login successful
          res.status(200).redirect("/");
        } else {
          res.status(401).render("login.ejs", {
            signed: false,
            error: { state: true, message: "Invalid Credentials" },
          });
        }
      } else {
        res.status(401).render("login.ejs", {
          error: { signed: false, state: true, message: "Invalid Credentials" },
        });
      }
    }
  );

  connection.end();
});

router.use("/", (req: Request, res: Response) => {
  res.render("login.ejs", { signed: false, error: {} });
});

export default router;
