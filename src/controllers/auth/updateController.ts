import { toastError, toastSuccess } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { User } from '@/types/types.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { generateSaltHashedPassword } from './authController.js';

export const getUserIdFromToken = (token: string): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    try {
      const connection = databaseConnect(); // Assuming databaseConnect returns a Promise resolving to a database connection

      const selectQuery = `
          SELECT userId
          FROM users
          WHERE token = ?;
        `;

      connection.execute(
        selectQuery,
        [token],
        (error: QueryError | null, results: RowDataPacket[]) => {
          if (error) {
            // Close the database connection
            connection.end();
            reject(error);
          } else {
            // Close the database connection
            connection.end();
            if (results.length > 0) {
              const user = results[0] as Partial<User>;
              resolve(user.userId ?? null);
            } else {
              resolve(null);
            }
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};

export const updatePassword = (req: Request, res: Response) => {
  const { newPassword, confirmPassword, token } = req.body;
  if (newPassword !== confirmPassword) {
    req.session.toast = toastError({ content: 'Passwords do not match' });
    res.redirect('/auth/update');
  } else {
    try {
      // Retrieve the user ID associated with the token from your database/temporary store
      getUserIdFromToken(token)
        .then((userId) => {
          if (!userId) {
            req.session.toast = toastError({ content: 'Invalid token' });
            res.redirect('/auth/update');
          } else {
            const { salt, hashPwd } = generateSaltHashedPassword(newPassword);

            const connection = databaseConnect(); // Assuming databaseConnect returns a Promise resolving to a database connection

            const updateQuery = `
          UPDATE users
          SET password = ?, salt = ?, token = NULL
          WHERE userId = ?;
          `;

            connection.execute(
              updateQuery,
              [hashPwd, salt, userId],
              (error: QueryError | null) => {
                if (error) {
                  databaseError(error);
                } else {
                  // Close the database connection
                  req.session.toast = toastSuccess({
                    content: 'Password updated succesfully ',
                  });
                  res.redirect('/auth/login');
                  databaseDisconnect(connection);
                }
              }
            );
          }
        })
        .catch((error: Error) => {
          console.error('Error retrieving user ID:', error);
          res.status(500).send('Error updating password.');
        });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).send('Error updating password.');
    }
  }
};
