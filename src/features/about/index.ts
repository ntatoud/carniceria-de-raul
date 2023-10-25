import { Router, Response, Request } from "express";

const router = Router();

router.use("/", (req: Request, res: Response) => {
  res.render("about.ejs");
});

export default router;
