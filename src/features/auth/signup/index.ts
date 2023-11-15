import { Router, urlencoded, Request, Response } from "express";
import { generate32ByteSalt, xorStringWith32ByteKey, sha256HexString } from "../util";

const router = Router();

router.use(urlencoded({ extended: true }));

// Define a route for handling POST requests to the "/login" endpoint
router.post('/sign', (req : Request, res : Response) => {
  const {name, surname, email, password} = req.body;
  // Access submitted data from the request body
  const salt = generate32ByteSalt();
  const saltedPwd = xorStringWith32ByteKey(password, salt);
  const hashPwd = sha256HexString(saltedPwd);
  // Send to DB name, surname, email, hashPwd
});

router.use("/", (req: Request, res: Response) => {
  res.render("signup.ejs");
});

export default router;
