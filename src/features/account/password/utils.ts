import { generateSaltHashedPassword, isPasswordCorrect } from "../../auth/util";
import { databaseConnect } from "../../../database";
import { Request, Response } from "express";
import { Connection, QueryError, RowDataPacket } from "mysql2";
import { User } from "@/features/types";

export const passwordUpdateIfOldPasswordCorrect = (
  req: Request,
  res: Response,
  userPasswordData: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  let result: RowDataPacket[] = [];
  const connection = databaseConnect();
  const selectQuery = "SELECT password, salt FROM users WHERE userId = ?";
  const selectQueryParams = [req.session.user?.userId];

  connection.execute(
    selectQuery,
    selectQueryParams,
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) throw new Error(error.message);

      console.log(result);
      if (isPasswordCorrect(userPasswordData.oldPassword, result[0] as User)) {
        passwordUpdate(req, res, connection, userPasswordData.newPassword);
      } else throw new Error("Wrong password");
    }
  );
};

const passwordUpdate = (
  req: Request,
  res: Response,
  connection: Connection,
  newPassword: string
) => {
  const { salt, hashPwd } = generateSaltHashedPassword(newPassword);

  const updateQuery =
    "UPDATE users SET \
    salt = ?,\
    password = ?\
    WHERE userId = ?;";
  const queryParams = [salt, hashPwd, req.session.user?.userId];
  connection.execute(
    updateQuery,
    queryParams,
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) throw new Error(error.message);

      res.redirect("/");
      connection.end();
    }
  );
};
