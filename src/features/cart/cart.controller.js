import CartItemModel from "../cart/cart.model.js";
import CartRepository from "./cart.repository.js";

export default class CartItemsController {
  constructor() {
    this.cartRepository = new CartRepository();
  }
  async addItem(req, res) {
    try {
      const { productID, quantity } = req.body;
      const userID = req.userID;
      console.log(userID);

      await this.cartRepository.add(productID, userID, quantity);

      res.status(201).send({ message: "Item added to cart successfully" });
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async getItem(req, res) {
    try {
      const userID = req.userID;
      const items = await this.cartRepository.get(userID);
      res.status(200).send(items);
    } catch (err) {
      console.log(err);
      return res.status(200).send("Something went wrong");
    }
  }

  async delete(req, res) {
    const userID = req.userID;
    const cartItemID = req.params.id;

    const isDeleted = await this.cartRepository.delete(userID, cartItemID);
    if (!isDeleted) {
      return res.status(404).send({ message: "Cart Item not found" });
    }
    return res.status(200).send({ message: "Car Item is removed" });
  }
}
