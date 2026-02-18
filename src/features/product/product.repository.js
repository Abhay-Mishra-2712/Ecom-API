import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import mongoose from "mongoose";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import { categorySchema } from "./category.schema.js";

const ProductModel = mongoose.model("Product", productSchema);
const ReviewModel = mongoose.model("Review", reviewSchema);
const CategoryModel = mongoose.model("Category", categorySchema);

class ProductRepository {
  constructor() {
    this.collection = "products";
  }

  async add(productData) {
    try {
      // // 1. Get the Database
      // const db = getDB();
      // // 2. Get the collection
      // const collection = db.collection(this.collection);
      // // 3. Insert the new document
      // await collection.insertOne(newproduct);
      // return newproduct;

      // Using Mongoose to add product

      productData.categories = productData.category
        .split(",")
        .map((e) => e.trim());

      console.log(productData);
      const newProduct = new ProductModel(productData);
      const savedProduct = await newProduct.save(); 

      // Update Categories with the new product
      await CategoryModel.updateMany(
        { _id: { $in: productData.categories } },
        { $push: { products: new ObjectId(savedProduct._id) } },
      );
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
  async getAll() {
    try {
      // 1. Get the Database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Fetch all products
      const products = await collection.find().toArray();
      return products;
    } catch (err) {
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async get(id) {
    try {
      // 1. Get the Database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);
      // 3. Fetch all products
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async filter(minPrice, category) {
    try {
      // 1. Get the Database
      const db = getDB();
      // 2. Get the collection
      const collection = db.collection(this.collection);

      let filterExpression = {};
      if (minPrice) {
        filterExpression.price = { $gte: parseFloat(minPrice) };
      }

      if (category) {
        filterExpression = { $and: [{ category: category }, filterExpression] };
        // filterExpression.category = category;
      }

      return await collection.find(filterExpression).toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  //   async rate(userID, productID, rating) {
  //     try {
  //       // 1. Get the Database
  //       const db = getDB();
  //       // 2. Get the collection
  //       const collection = db.collection(this.collection);

  //       //   find the product
  //       const product = await collection.findOne({
  //         _id: new ObjectId(productID),
  //       });
  //       //   find existing rating by user
  //       const userRating = product?.ratings?.find((r) => r.userID == userID);
  //       if (userRating) {
  //         // update the rating
  //         await collection.updateOne(
  //           {
  //             _id: new ObjectId(productID),
  //             "ratings.userID": new ObjectId(userID),
  //           },
  //           { $set: { "ratings.$.rating": rating } }
  //         );
  //       } else {
  //         collection.updateOne(
  //           { _id: new ObjectId(productID) },
  //           {
  //             $push: { ratings: { userID: new ObjectId(userID), rating } },
  //           }
  //         );
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       throw new ApplicationError("Something went wrong with the database", 500);
  //     }
  //   }

  async rate(userID, productID, rating) {
    try {
      // // 1. Get the Database
      // const db = getDB();
      // // 2. Get the collection
      // const collection = db.collection(this.collection);

      // //   reomeve existing rating by user
      // await collection.updateOne(
      //   { _id: new ObjectId(productID) },
      //   { $pull: { ratings: { userID: new ObjectId(userID) } } },
      // );

      // //   add new rating
      // await collection.updateOne(
      //   { _id: new ObjectId(productID) },
      //   {
      //     $push: { ratings: { userID: new ObjectId(userID), rating } },
      //   },
      // );

      // check if product exist
      const productToUpdate = await ProductModel.findById(productID);
      if (!productToUpdate) {
        throw new Error("Product not found");
      }
      // get the Existing review by user
      const userReview = await ReviewModel.findOne({
        product: new ObjectId(productID),
        user: new ObjectId(userID),
      });

      if (userReview) {
        // update the rating
        userReview.rating = rating;
        await userReview.save();
      } else {
        // create new review
        const newReview = new ReviewModel({
          product: new ObjectId(productID),
          user: new ObjectId(userID),
          rating: rating,
        });
        await newReview.save();
      }
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }

  async averageProductPricePerCategory() {
    try {
      const db = getDB();
      return await db
        .collection(this.collection)
        .aggregate([
          {
            $group: {
              _id: "$category",
              averagePrice: { $avg: "$price" },
            },
          },
        ])
        .toArray();
    } catch (err) {
      console.log(err);
      throw new ApplicationError("Something went wrong with the database", 500);
    }
  }
}

export default ProductRepository;
