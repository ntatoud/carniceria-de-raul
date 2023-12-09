import { Router, urlencoded, Request, Response, NextFunction } from "express";

import signup from "./signup";
import login from "./login";
import reset from "./reset";
const router = Router();

router.use(urlencoded({ extended: true }));
router.use("/reset", reset);
router.use("/login", login);
router.use("/signup", signup);

router.use("/logout", (req: Request, res: Response) => {
  req.session.destroy((error: ErrorEvent) => {
    if (error) throw new Error(error.message);
  });
  res.redirect("/");
});

router.use("/", (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect("/");
  } else {
    res.redirect("/auth/login");
  }
});

export default router;
