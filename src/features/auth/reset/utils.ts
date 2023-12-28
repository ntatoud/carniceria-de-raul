import dotenv from 'dotenv';
dotenv.config();

export const generateResetLink = (token: string): string => {
  return `${process.env.API_URL}/auth/update?token=${token}`;
};
