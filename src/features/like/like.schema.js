import mongoose from "mongoose";

export const likeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  likeable: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "types",
  },

  type: {
    type: String,
    enum: ["Product", "Category"],
  },
})
  .pre("save", (next) => {
    console.log("New Like coming in");

  
  })
  .post("save", (doc) => {
    console.log("Like is saved");
    console.log(doc);
  }).pre("find" ,(next)=>{
    console.log("retrieving likes");
    
  }).post("find",(docs)=>{
    console.log("Find Is completed");
    console.log(docs);
  });
