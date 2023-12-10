import { Router, urlencoded, Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { v4 as uuidv4 } from 'uuid'; // Import UUID for generating unique tokens
import { databaseConnect } from '../../../database'; // Import your database connection module
import dotenv from 'dotenv';
import { generateResetLink } from './utils';

dotenv.config(); // Load environment variables from .env file

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/', (req: Request, res: Response) => {
  const userEmail = req.body.email; // Assuming the email is sent as part of the request body
  const resetToken = uuidv4(); // Generate a unique token for this reset request
  try {
    const connection = databaseConnect(); // Establish database connection

    // Update the token for the user identified by the provided email
    const updateTokenQuery = `
      UPDATE users
      SET token = ?
      WHERE email = ?;
    `;

    connection.execute(updateTokenQuery, [resetToken, userEmail]);

    const resetLink = generateResetLink(resetToken); // Pass the token to the reset link

    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com', // Outlook SMTP server
      port: 587, // Outlook SMTP port
      secure: false, // TLS requires secureConnection to be false
      auth: {
        user: process.env.EMAIL, // Access email from environment variable
        pass: process.env.PASSWORD, // Access password from environment variable
      },
      connectionTimeout: 20000, // Timeout di 10 secondi (valore in millisecondi)
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: 'Reset Your Password',
      text: `Click on the link to reset your password: ${resetLink}`,
    };

    transporter.sendMail(mailOptions);

    res.send('Reset link sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending reset link.');
  }
});

router.use('/', (req: Request, res: Response) => {
  res.render('reset.ejs');
});

export default router;
