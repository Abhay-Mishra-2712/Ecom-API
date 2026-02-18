import { LikeRepository } from "./like.repository.js";

export class LikeController {
  constructor() {
    this.likeRepository = new LikeRepository();
  }
  async likeItem(req, res, next) {
    try {
      const { id, type } = req.body;
      const userID = req.userID;
      if (!["Product", "Category"].includes(type)) {
        return res.status(400).send({ message: "Invalid type provided" });
      }
      if (type === "Product") {
        await this.likeRepository.likeProduct(userID, id);
      } else {
        await this.likeRepository.likeCategory(userID, id);
      }

      return res.status(200).send({ message: "Item liked successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong" });
    }


  }

  async getLikes(req, res, next) {
    try {
      const { id, type } = req.query;
      const likes = await this.likeRepository.getLikes(type, id);
      return res.status(200).send(likes);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Something went wrong" });
    }
  }
}
