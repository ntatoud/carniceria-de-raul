import { toastSuccess } from '@/components/toast/index.js';
import { databaseConnect, databaseDisconnect } from '@/database/index.js';
import i18next from '@/lib/i18n/config.js';
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
        if (error) res.status(502).send(error);

        if (!result.length) {
          req.session.toast = toastSuccess({
            title: i18next.t('main:toast.success.reset.title'),
            content: i18next.t('main:toast.success.reset.content'),
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
            title: i18next.t('main:toast.success.reset.title'),
            content: i18next.t('main:toast.success.reset.content'),
          });
          res.redirect('/auth/login');
        }

        databaseDisconnect(connection);
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending reset link.');
  }
};
