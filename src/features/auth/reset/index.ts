import { Router, urlencoded, Request, Response, NextFunction } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/", (req: Request, res: Response) => {
  res.render("reset.ejs", {
    isLogged: req.session.isLogged,
    sessionUser: req.session.user,
  });
});

export default router;
