import { Router, urlencoded, Request, Response } from "express";
import { getOrderFromId, getOrderList, orderDelete } from "./utils";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/delete/:id", (req: Request, res: Response) => {
  const orderId = req.params.id;
  orderDelete(res, orderId);
});

router.use("/:id", (req: Request, res: Response) => {
  getOrderFromId(req, res, req.params.id);
});

router.use("/", (req: Request, res: Response) => {
  getOrderList(req, res);
});

export default router;
