import { Request, Response, Router, urlencoded } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/", (req: Request, res: Response) => {
  console.log(req.body);
});
router.use("/", (req: Request, res: Response) => {
  res.render("infos.ejs", {
    isLogged: req.session.isLogged,
    account: req.session.user,
  });
});

export default router;
