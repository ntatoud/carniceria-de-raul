import { Request, Response, Router, urlencoded } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  res.render("infos.ejs", { isLogged: req.session.isLogged });
});

export default router;
