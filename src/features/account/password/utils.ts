import {
  generateSaltHashedPassword,
  isPasswordCorrect,
} from '@/features/auth/util.js';
import { databaseConnect, databaseDisconnect } from '@/database/index.js';
import { Request, Response } from 'express';
import { Connection, QueryError, RowDataPacket } from 'mysql2';
import { User } from '@/features/types.js';
import { toastError, toastSuccess } from '@/components/toast/index.js';

export const passwordUpdateIfOldPasswordCorrect = (
  req: Request,
  res: Response,
  userPasswordData: {
    oldPassword: string;
    newPassword: string;
  }
) => {
  const connection = databaseConnect();
  const selectQuery = 'SELECT password, salt FROM users WHERE userId = ?';
  const selectQueryParams = [req.session.user?.userId];

  connection.execute(
    selectQuery,
    selectQueryParams,
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) console.error(error.message);

      if (isPasswordCorrect(userPasswordData.oldPassword, result[0] as User)) {
        passwordUpdate(req, res, connection, userPasswordData.newPassword);
      } else {
        req.session.toast = toastError({ content: 'Wrong password' });
        res.redirect('/account/password');
      }

      databaseDisconnect(connection);
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
    'UPDATE users SET \
    salt = ?,\
    password = ?\
    WHERE userId = ?;';
  const queryParams = [salt, hashPwd, req.session.user?.userId];

  connection.execute(updateQuery, queryParams, (error: QueryError | null) => {
    if (error) console.error(error.message);

    req.session.toast = toastSuccess({
      content: 'Password updated succesfully',
    });
    res.redirect('/account/profile');

    databaseDisconnect(connection);
  });
};
