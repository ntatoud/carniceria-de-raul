import { Router, urlencoded, Request, Response } from "express";
import { xorStringWith32ByteKey, sha256HexString, generate32ByteSalt } from "../util";
const router = Router();

router.use(urlencoded({ extended: true }));

// Define a route for handling POST requests to the "/login" endpoint
router.post('/log', (req : Request, res : Response) => {
  // Access submitted data from the request body
  const { email, password } = req.body;
//Send email to server and request associated salt
//Calculate the xor of password with salt
//SHA256 of the result of the xor
//Send to server email and saltedhashpwd

//  if (email === 'exampleUser' && password === 'examplePassword') {
//    res.status(200).json({ message: 'Login successful' });
//  } else {
//    res.status(401).json({ message: 'Invalid username or password' });
//  }
});

router.use("/", (req: Request, res: Response) => {
  res.render("login.ejs");
});

export default router;
