import "./env.js";
// 1. Import the express module
import express from "express";
import swagger from "swagger-ui-express";
import mongoose from "mongoose";   

import cors from "cors";
import bodyParser from "body-parser";
import productRouter from "./src/features/product/product.routes.js";
import userRouter from "./src/features/user/user.routes.js";
import jwtAuth from "./src/middleware/jwt.middleware.js";
import cartRouter from "./src/features/cart/cart.routes.js";
import apiDocs from "./swagger.json" with { type: "json" };
import loggerMiddleware from "./src/middleware/logger.middleware.js";
import { connectToMongoDB } from "./src/config/mongodb.js";
import { ApplicationError } from "./src/error-handler/applicationError.js";
import orderRouter from "./src/features/order/order.routes.js";
import { connectUsingMongoose } from "./src/config/mongooseConfig.js";
import likeRouter from "./src/features/like/like.routes.js";

// 2.Create Server
const server = express();

// CORS policy configuration

var corsOptions = {
  origin: "http://localhost:5500",
};
server.use(cors(corsOptions));

// server.use((req, res, next)=>{
//   res.header('Access-Control-Allow-Origin','http://localhost:5500');
//   res.header('Access-Control-Allow-Headers','*');
//   res.header('Access-Control-Allow-Methods','*');
//   // return ok for preflight request.
//   if(req.method=="OPTIONS"){
//     return res.sendStatus(200);
//   }
//   next();
// })

// Middleware to parse JSON bodies
server.use(bodyParser.json());

// Swagger API documentation route
server.use("/api-docs", swagger.serve, swagger.setup(apiDocs));

// Logger Middleware to log request bodies
server.use(loggerMiddleware);

// for all request rlated to orders, use the OrderRouter
server.use("/api/orders", jwtAuth, orderRouter);

// for all requests related to products, use the ProductRouter
server.use("/api/products", jwtAuth, productRouter);

// for all requests related to cart, use the CartRouter
server.use("/api/cartItems", jwtAuth, cartRouter);

// for all requests related to users, use the UserRouter
server.use("/api/users", userRouter);

// for all request for liking the products
server.use("/api/like", jwtAuth, likeRouter);

// 3. Default Request Handler

server.get("/", (req, res) => {
  res.send("Welcome to the Ecomm API");
});

// error handling middleware
server.use((err, req, res, next) => {
  console.log(err);
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).send(err.message);
  }

  if (err instanceof ApplicationError) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  // server error
  res.status(500).send({ message: "Internal Server Error, please try later!" });
});

// 4.Middleware to handle 404 - Resource Not Found
server.use((req, res, next) => {
  res.status(404).send({ message: "API Not Found" });
});

// 5. Specify the port number
server.listen(3200, () => {
  console.log("Server is running on http://localhost:3200");
  // Connect using Mongoose
  connectUsingMongoose();
});
