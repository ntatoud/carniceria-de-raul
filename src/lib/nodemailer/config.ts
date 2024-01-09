import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file
import { createTransport } from 'nodemailer';
const transporter = createTransport({
  host: process.env.SMTP_HOST as string, // Outlook SMTP server
  port: process.env.SMTP_PORT, // Outlook SMTP port
  secure: false, // TLS requires secureConnection to be false
  auth: {
    user: process.env.EMAIL, // Access email from environment variable
    pass: process.env.PASSWORD, // Access password from environment variable
  },
  connectionTimeout: 20000, // Timeout di 10 secondi (valore in millisecondi)
});

const resetLinkBaseMailOptions = {
  from: process.env.EMAIL,
  subject: 'Reset Your Password',
};

export const sendResetMail = (to: string, resetLink: string) =>
  transporter.sendMail({
    to,
    text: `Click on the link to reset your password: ${resetLink}`,
    ...resetLinkBaseMailOptions,
  });
