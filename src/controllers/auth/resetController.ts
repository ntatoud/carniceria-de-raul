import { toastSuccess } from '@/components/toast/index.js';
import { databaseConnect } from '@/database/index.js';
import { sendResetMail } from '@/lib/nodemailer/config.js';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

export const generateResetLink = (token: string): string => {
  return `${
    process.env.API_URL ?? 'http://localhost:3000'
  }/auth/update?token=${token}`;
};

export const sendResetMailToUserEmail = (req: Request, res: Response) => {
  const userEmail = req.body.email; // Assuming the email is sent as part of the request body
  const resetToken = uuidv4(); // Generate a unique token for this reset request

  try {
    const connection = databaseConnect(); // Establish database connection
    const checkEmailTakenQuery = 'SELECT * FROM users WHERE email = ?';

    connection.execute(
      checkEmailTakenQuery,
      [userEmail],
      (error: QueryError | null, result: RowDataPacket[]) => {
        console.log('BEGINNING OF SMTP RES');
        console.log(res);
        console.log('END OF SMTP RES');
        if (error) res.status(502).send(error);

        if (!result.length) {
          req.session.toast = toastSuccess({
            title: 'Check your mail inbox',
            content: 'If an account exists, the reset link has been sent.',
          });
          res.redirect('/auth/login');
        } else {
          // Update the token for the user identified by the provided email
          const updateTokenQuery = `
    UPDATE users
    SET token = ?
    WHERE email = ?;
  `;

          connection.execute(updateTokenQuery, [resetToken, userEmail]);

          const resetLink = generateResetLink(resetToken); // Pass the token to the reset link

          sendResetMail(userEmail, resetLink);
          req.session.toast = toastSuccess({
            title: 'Check your mail inbox',
            content: 'If an account exists, the reset link has been sent.',
          });
          res.redirect('/auth/login');
        }
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending reset link.');
  }
};
