import { Router, Response, Request } from "express";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  console.log(req.body);
  res.render("profile.ejs", {
    accountName: "Nombre de usuario",
    isLogged: req.session.isLogged,
  });
});
router.use("/", (req: Request, res: Response) => {
  res.render("profile.ejs", {
    accountName: "Nombre de usuario",
    isLogged: req.session.isLogged,
  });
});

export default router;
