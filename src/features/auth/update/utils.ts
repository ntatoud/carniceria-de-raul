import { databaseConnect } from '../../../database';
import { User } from '@/features/types';
import { QueryError, RowDataPacket } from 'mysql2';

export const getUserIdFromToken = (token: string): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    try {
      const connection = databaseConnect(); // Assuming databaseConnect returns a Promise resolving to a database connection

      const selectQuery = `
          SELECT user_id
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
              resolve(user.id ?? null);
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
