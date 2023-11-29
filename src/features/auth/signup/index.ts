/**
 * Author: Sica Mattia
 * Description: This module contains functions related to user authentication.
 */

import { Router, urlencoded, Request, Response } from "express";
import { generate32ByteSalt, xorStringWith32ByteKey, sha256HexString } from "../util";
import { databaseConnect } from "../../../database";

const router = Router();

router.use(urlencoded({ extended: true }));

// Define a route for handling POST requests to the "/login" endpoint
router.post('/sign', (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;
  const salt = generate32ByteSalt();
  const saltedPwd = xorStringWith32ByteKey(password, salt);
  const hashPwd = sha256HexString(saltedPwd);

  try {
    const connection = databaseConnect(); // Assuming databaseConnect returns a Promise resolving to a database connection

    const insertQuery = `
      INSERT INTO users (name, surname, email, password, salt)
      VALUES (?, ?, ?, ?, ?);
    `;

    connection.execute(insertQuery, [name, surname, email, hashPwd, salt]); // Using execute for promises

    connection.end();

    res.status(200).send('User registered successfully.');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Error registering user.');
  }
});

router.use("/", (req: Request, res: Response) => {
  res.render("signup.ejs");
});

export default router;
