import { Router, urlencoded, Request, Response } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  if (req.session.isLogged) {
    res.redirect("/");
  } else {
    res.render("reset.ejs", { isLogged: req.session.isLogged });
  }
});

export default router;
