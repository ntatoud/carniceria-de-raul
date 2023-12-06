import { Router, urlencoded, Request, Response } from "express";
import { generate32ByteSalt, xorStringWith32ByteKey, sha256HexString } from "../util";
import { databaseConnect } from "../../../database";
import { RowDataPacket } from "mysql2";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/updatePassword', (req: Request, res: Response) => {
  const { newPassword, confirmPassword, token } = req.body;
  
  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).send("Passwords do not match.");
  }

  try {
    // Retrieve the user ID associated with the token from your database/temporary store
    getUserIdFromToken(token)
      .then((userId) => {
        if (!userId) {
          return res.status(404).send('User not found for this reset link.');
        }

        const salt = generate32ByteSalt();
        const saltedPwd = xorStringWith32ByteKey(newPassword, salt);
        const hashPwd = sha256HexString(saltedPwd);

        const connection = databaseConnect(); // Assuming databaseConnect returns a Promise resolving to a database connection

        const updateQuery = `
          UPDATE users
          SET password = ?, salt = ?, token = NULL
          WHERE user_id = ?;
        `;

        connection.execute(updateQuery, [hashPwd, salt, userId], (error) => {
          if (error) {
            console.error('Error updating password:', error);
            res.status(500).send('Error updating password.');
          } else {
            // Close the database connection
            connection.end();
            res.status(200).send('Password updated successfully.');
          }
        });
      })
      .catch((error) => {
        console.error('Error retrieving user ID:', error);
        res.status(500).send('Error updating password.');
      });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Error updating password.');
  }
});

function getUserIdFromToken(token: string): Promise<number | null> {
  return new Promise((resolve, reject) => {
    try {
      const connection = databaseConnect(); // Assuming databaseConnect returns a Promise resolving to a database connection

      const selectQuery = `
        SELECT user_id
        FROM users
        WHERE token = ?;
      `;

      connection.execute(selectQuery, [token], (error, results) => {
        if (error) {
          // Close the database connection
          connection.end();
          reject(error);
        } else {
          // Close the database connection
          connection.end();
          if (Array.isArray(results) && results.length > 0) {
            const row = results[0] as RowDataPacket;
            resolve(row.user_id);
          } else {
            resolve(null);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

router.use('/', (req: Request, res: Response) => {
  const { token } = req.query;
  res.render("update.ejs", { token });
});

export default router;
