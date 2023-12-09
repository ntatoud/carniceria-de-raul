import { Router, urlencoded, Request, Response, query } from "express";
import { isPasswordCorrect } from "../util";
import { databaseConnect } from "../../../database";
import { QueryError, RowDataPacket } from "mysql2/promise";
import { User } from "@/features/types";
import { createSession } from "./utils";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/", (req: Request, res: Response) => {
  const { email, password } = req.body;

  const connection = databaseConnect(); // Establish database connection

  const selectQuery = `
      SELECT *
      FROM users
      WHERE email = ?`;
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

        if (isPasswordCorrect(password, userData)) {
          const { salt, password, ...safeUser } = userData;
          // Passwords match, login successful, we create the session
          createSession(req.session, safeUser);
          res.status(200).redirect("/");
        } else {
          res.status(401).render("login.ejs", {
            error: {
              state: true,
              message: "Invalid Credentials",
            },
            isLogged: req.session.isLogged,
            sessionUser: req.session.user,
          });
        }
      } else {
        res.status(401).render("login.ejs", {
          error: {
            state: true,
            message: "Invalid Credentials",
          },
          isLogged: req.session.isLogged,
          sessionUser: req.session.user,
        });
      }
    }
  );

  connection.end();
});

router.use("/", (req: Request, res: Response) => {
  res.render("login.ejs", {
    signed: false,
    error: {},
    isLogged: req.session.isLogged,
    sessionUser: req.session.user,
  });
});

export default router;
