import mysql, { Connection, QueryError } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const databaseCredentials = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

export const databaseConnect = (endpoint?: string): Connection => {
  if (process.env.LOG_DETAILS === 'verbose') {
    console.log(endpoint ? `Connected to ${endpoint}` : 'Connected');
  }
  return mysql.createConnection({
    database: process.env.DATABASE_NAME,
    ...databaseCredentials,
  });
};

export const databaseDisconnect = (connection: Connection, endpoint?: string) =>
  connection.end((error: QueryError | null) => {
    if (error) {
      console.error(error.message);
    }
    if (process.env.LOG_DETAILS === 'verbose') {
      console.log(endpoint ? `Disconnected from ${endpoint}` : 'Disconnected');
    }
  });
