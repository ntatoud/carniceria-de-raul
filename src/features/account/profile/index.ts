import { Router, Response, Request } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.render("profile.ejs", {
    accountName: "Nombre de usuario",
    isLogged: req.session.isLogged,
    sessionUser: req.session.user,
  });
});
router.use("/", (req: Request, res: Response) => {
  console.log(req.session.user);
  res.render("profile.ejs", {
    accountName: "Nombre de usuario",
    isLogged: req.session.isLogged,
    sessionUser: req.session.user,
  });
});

export default router;
