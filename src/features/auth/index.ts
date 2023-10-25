import { Router, urlencoded, Request, Response } from "express";

import signup from "./signup";
import login from "./login";

const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/login", login);
router.use("/singup", signup);

router.use("/", (req: Request, res: Response) => {
  res.redirect("/auth/login");
});

export default router;
