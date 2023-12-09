import { Router, urlencoded, Request, Response, NextFunction } from "express";
import { checkEmailTaken, isStrongPassword, registerIfPossible } from "./utils";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/checkEmail", (req, res) => {
  checkEmailTaken(res, req.body.email);
});

router.post("/checkPassword", (req, res) => {
  const { isStrong, problems } = isStrongPassword(req.body.password);

  res.status(200).send(isStrong ? "OK" : problems);
});

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  registerIfPossible(req, res, req.body);
});

router.use("/", (req: Request, res: Response) => {
  res.render("signup.ejs", { error: {}, isLogged: req.session.isLogged });
});

export default router;
