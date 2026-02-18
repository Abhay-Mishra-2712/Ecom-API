import mongoose from "mongoose";
import dotenv from "dotenv";
import { categorySchema } from "../features/product/category.schema.js";


dotenv.config();

const url = process.env.DB_URL;

export const connectUsingMongoose = async () => {
  try {
    await mongoose.connect(url);
    console.log("Connected to MongoDB using Mongoose");
    addCategories();
  } catch (err) {
    console.log(err);
  }
};

async function addCategories() {
  const categoryModel = mongoose.model("Category", categorySchema);

  const categories = await categoryModel.find();

  if (!categories || categories.length === 0) {
    await categoryModel.insertMany([
      { name: "Electronics" },
      { name: "Books" },
      { name: "Clothing" },
    ]);
  }

  console.log("Categories added successfully");
}
