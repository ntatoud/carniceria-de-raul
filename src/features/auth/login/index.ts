/**
 * Author: Sica Mattia
 * Description: This module contains functions related to user authentication.
 */

import { Router, urlencoded, Request, Response } from "express";
import { xorStringWith32ByteKey, sha256HexString } from "../util";
import { databaseConnect } from "../../../database";
import { QueryError } from "mysql2/promise"; // Import mysql2/promise
import { User } from "@/features/types";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/log', (req: Request, res: Response) => {
  const email = req.body.email
  const password = req.body.password;

  try {
    const connection =  databaseConnect(); // Establish database connection

    const selectQuery = `
      SELECT user_id, email, password, salt
      FROM users
      WHERE email = "${email}";
    `;

    connection.execute(selectQuery, (error: QueryError, result : Partial<User>[]) => {
      
      const userData: Partial<User> = result[0];
      if (userData) {
        const saltedPwd = xorStringWith32ByteKey(password, userData.salt ?? "");
        const hashPwd = sha256HexString(saltedPwd);
        
        if (hashPwd === userData.password) {
          // Passwords match, login successful
          res.status(200).send('Login successful.');
        } else {
          // Passwords don't match
          res.status(401).send('Invalid Credentials');
        }
      }  else {
        // Passwords don't match
        res.status(401).send('Invalid Credentials');
        } });

    connection.end();

  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Error logging in.');
  }
});

router.use("/", (req: Request, res: Response) => {
  res.render("login.ejs");
});

export default router;

