import express from "express";
import CartItemsController from "./cart.controller.js";

const cartRouter = express.Router();

const cartController = new CartItemsController();

cartRouter.delete("/:id", (req, res) => {
  cartController.delete(req, res);
});

cartRouter.post("/", (req, res) => {
  cartController.addItem(req, res);
});
cartRouter.get("/", (req, res) => {
  cartController.getItem(req, res);
});

export default cartRouter;
