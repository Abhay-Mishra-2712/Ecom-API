import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import OrderMOdel from "./order.model.js";

export default class OrderRepository {
  constructor() {
    this.collections = "orders";
  }

  async placeOrder(userID) {
    const client = getClient();
    const session = client.startSession();
    try {
      const db = getDB();
      session.startTransaction();
      // 1.Get cart items and calculate total amount
      const items = await this.getTotalAmount(userID, session);
      const finalAmount = items.reduce(
        (acc, item) => acc + item.totalAmount,
        0,
      );
      console.log(finalAmount);
      // 2.Create order object

      const newOrder = new OrderMOdel(
        new ObjectId(userID),
        finalAmount,
        new Date(),
      );
      await db.collection(this.collections).insertOne(newOrder, { session });

      //3.Reduce the Stock
      for (let item of items) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productID },
            { $inc: { stock: -item.quantity } },
            { session },
          );
      }
      throw new Error("Something went wrong in placeorder");
      // 4.Clear cart items
      await db
        .collection("cartItems")
        .deleteMany({ userID: new ObjectId(userID) }, { session });
      session.commitTransaction();
      session.endSession();
      return;
    } catch (err) {
      await session.abortTransaction();
      session.endSession();
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async getTotalAmount(userID, session) {
    const db = getDB();

    const items = await db
      .collection("cartItems")
      .aggregate(
        [
          // stage 1: get  cart items for the user
          { $match: { userID: new ObjectId(userID) } },
          // stage 2: get the products  from the products collection
          {
            $lookup: {
              from: "products",
              localField: "productID",
              foreignField: "_id",
              as: "productInfo",
            },
          },
          // stage 3: Unwind the productInfo array
          { $unwind: "$productInfo" },
          // stage 4: Calculate total amount for each cart item
          {
            $addFields: {
              totalAmount: { $multiply: ["$quantity", "$productInfo.price"] },
            },
          },
        ],
        { session },
      )
      .toArray();
    return items;
  }
}
