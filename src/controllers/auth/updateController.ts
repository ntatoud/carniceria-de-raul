import { databaseConnect } from '@/database/index.js';
import { User } from '@/types/types.js';
import { QueryError, RowDataPacket } from 'mysql2';

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
