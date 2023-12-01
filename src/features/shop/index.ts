import { Router, Response, Request } from "express";
import {
  getAllProductsWithCategory,
  renderCategoryPage,
  renderProductPage,
  renderShopHome,
} from "./utils";
const router = Router();

router.use("/:category/:product_id", (req: Request, res: Response) => {
  const currentCategory = req.params.category ?? "";
  const productId = req.params.product_id ?? 0;

  renderProductPage({ res, currentCategory, productId });
});

router.get("/:category", (req: Request, res: Response) => {
  const currentCategory = req.params.category;
  const isOnlyOffers = req.url.includes("offertas=on");
  const isSortedByPrice = req.url.includes("price=on");
  const isSortedByName = req.url.includes("name=on");

  renderCategoryPage({
    res,
    currentCategory,
    isOnlyOffers,
    isSortedByPrice,
    isSortedByName,
  });
});

router.use("/", (req: Request, res: Response) => {
  getAllProductsWithCategory(res);
});

export default router;
