import mysql, { Connection } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

export const databaseCredentials = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
};

export const databaseConnect = (): Connection => {
    return mysql.createConnection({
        database: process.env.DATABASE_NAME,
        ...databaseCredentials,
    });
};
