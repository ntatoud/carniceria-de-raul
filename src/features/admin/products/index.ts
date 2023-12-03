import { Router, urlencoded, Request, Response } from "express";
import {
  getProductList,
  getProductToUpdate,
  productCreate,
  productDelete,
  productUpdate,
} from "./utils";

const router = Router();

router.use(urlencoded({ extended: true }));

router.post("/delete/:id", (req: Request, res: Response) => {
  const productId = req.params.id;
  productDelete(res, productId);
});

router.post("/create", (req: Request, res: Response) => {
  productCreate(res, req.body);
});

router.use("/create", (req: Request, res: Response) => {
  res.render("productCreate.ejs", { product: undefined });
});

router.post("/update/:id", (req: Request, res: Response) => {
  productUpdate(res, req.body, req.params.id);
});

router.use("/update/:id", (req: Request, res: Response) => {
  getProductToUpdate(res, req.params.id);
});

router.use("/", (req: Request, res: Response) => {
  getProductList(res);
});

export default router;
