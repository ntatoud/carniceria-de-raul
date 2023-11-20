import { Router, urlencoded, Request, Response } from "express";

const router = Router();

router.use(urlencoded({ extended: true }));

type User = {
  name: string;
  id: string;
  email: string;
  status: string;
  authorities: boolean;
};

const dataFromBack: User[] = [
  { name: "TRUC", id: "10", email: "dad", status: "oui", authorities: true },
];
router.use("/", (req: Request, res: Response) => {
  res.render("users.ejs", { dataToFront: dataFromBack });
});

export default router;
