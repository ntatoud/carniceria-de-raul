import { Router, urlencoded, Request, Response } from "express";
import profile from "./profile";
import password from "./password";
const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/profile", profile);
router.use("/password", password);
router.use("/", (req: Request, res: Response) => {
  res.redirect("/account/profile");
});

export default router;
