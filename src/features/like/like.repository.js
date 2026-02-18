import mongoose from "mongoose";
import { likeSchema } from "./like.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";

const LikeModel = mongoose.model("Like", likeSchema);

export class LikeRepository {
  async getLikes(type, id) {
    try {
      return await LikeModel.find({
        likeable: new ObjectId(id),
        type: type,
      })
        .populate("user")
        .populate({ path: "likeable", model: type });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async likeProduct(userId, productId) {
    try {
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(productId),
        type: "Product",
      });

      await newLike.save();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async likeCategory(userId, categoryId) {
    try {
      const newLike = new LikeModel({
        user: new ObjectId(userId),
        likeable: new ObjectId(categoryId),
        type: "Category",
      });
      await newLike.save();
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
}
