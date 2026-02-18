import express from "express";
import ProductController from "./product.controller.js";
import { upload } from "../../middleware/fileupload.middleware.js";

const productRouter = express.Router();

const productController = new ProductController();

// localhost:3200/api/products/filter?minPrice=10&maxPrice=50&category=Category1[this is specific route for filtering]

productRouter.post("/rate", (req, res) => {
  productController.rateProduct(req, res);
});

productRouter.get("/filter", (req, res) => {
  productController.filterProducts(req, res);
});

productRouter.get("/", (req, res) => {
  productController.getAllProducts(req, res);
});
productRouter.post("/", upload.single("imageUrl"), (req, res) => {
  productController.addProduct(req, res);
});
productRouter.get("/averagePrice", (req, res, next) => {
  productController.averagePrice(req, res, next);
});
productRouter.get("/:id", (req, res) => {
  productController.getOneProduct(req, res);
});

export default productRouter;
