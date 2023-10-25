import { Router, urlencoded, Request, Response } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  res.render("users.ejs");
});

export default router;
