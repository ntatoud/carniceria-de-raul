import { Router, urlencoded, Request, Response } from 'express';
import { generateSaltHashedPassword } from '@/controllers/auth/authController.js';
import { databaseConnect } from '@/database/index.js';
import { QueryError } from 'mysql2';
import { getUserIdFromToken } from '@/controllers/auth/updateController.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/', (req: Request, res: Response) => {
  const { newPassword, confirmPassword, token } = req.body;
  // Check if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    return res.status(400).send('Passwords do not match.');
  }

  try {
    // Retrieve the user ID associated with the token from your database/temporary store
    getUserIdFromToken(token)
      .then((userId) => {
        if (!userId) {
          return res.status(404).send('User not found for this reset link.');
        }

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
              console.error('Error updating password:', error);
              res.status(500).send('Error updating password.');
            } else {
              // Close the database connection
              connection.end();
              res.status(200).send('Password updated successfully.');
            }
          }
        );
      })
      .catch((error: Error) => {
        console.error('Error retrieving user ID:', error);
        res.status(500).send('Error updating password.');
      });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).send('Error updating password.');
  }
});

router.use('/', (req: Request, res: Response) => {
  const token = req.query.token;
  res.render('update.ejs', {
    token,
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
  });
});

export default router;
