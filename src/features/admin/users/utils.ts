import { generateSaltHashedPassword } from "../../auth/util";
import { databaseConnect } from "../../../database";
import { User } from "@/features/types";
import { Request, Response } from "express";
import { QueryError } from "mysql2";

export const userCreate = (res: Response, user: Partial<User>) => {
  const connection = databaseConnect();
  const { salt, hashPwd } = generateSaltHashedPassword("admin");
  const queryParams = [
    user.email,
    hashPwd,
    salt,
    user.authorities,
    user.name,
    user.surname,
  ];
  const createUserQuery =
    "INSERT INTO users (email, password, salt, authorities, name, surname) VALUES (?, ?, ?, ?, ?, ?);";

  connection.query(createUserQuery, queryParams, (error: QueryError | null) => {
    if (error) {
      throw new Error(error.message);
    } else {
      res.redirect(302, "/admin/users");
    }
  });
};

export const userUpdate = (res: Response, user: Partial<User>, id: string) => {
  const connection = databaseConnect();
  const queryParams = [
    user.email,
    user.authorities,
    user.name,
    user.surname,
    id,
  ];
  const updateUserQuery =
    "UPDATE users SET email = ?, authorities = ?, name = ?, surname = ? WHERE userId = ?;";
  connection.query(updateUserQuery, queryParams, (error: QueryError | null) => {
    if (error) throw new Error(error.message);
    else {
      res.redirect("/admin/users");
    }
  });
};

export const getUserToUpdate = (req: Request, res: Response, id: string) => {
  const getUserQuery =
    "SELECT userId, email, name, surname, authorities FROM users WHERE userId= ?;";

  const connection = databaseConnect();

  // type todo
  connection.query(
    getUserQuery,
    [id],
    (error: QueryError | null, result: any) => {
      if (error) {
        throw new Error(error.message);
      } else {
        res.render("userUpdate.ejs", {
          user: result[0] as Partial<User>,
          isLogged: req.session.isLogged,
          account: req.session.user,
        });
      }
    }
  );
};

export const getUserList = (req: Request, res: Response) => {
  const connection = databaseConnect();
  connection.query(
    "SELECT name, surname, email, userId, authorities FROM users;",
    (error: QueryError, results: Partial<User>[]) => {
      if (error) {
        res.send("404");
        throw new Error(error.message);
      }
      res.render("users.ejs", {
        users: results,
        isLogged: req.session.isLogged,
        account: req.session.user,
      });
    }
  );
};

export const userDelete = (res: Response, userId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users WHERE userId = ?;`;
  connection.query(deleteQuery, [userId], (error: QueryError | null) => {
    if (error) throw new Error(error.message);

    res.status(200).send("OK");
  });
};
