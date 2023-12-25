import mongoose from "mongoose";
import { commentSchema } from "./comments.js";

export const postsSchema = mongoose.Schema({
  author: String,
  postedDate: Date,
  postBody: String,
  comments:{
    type:[commentSchema],
    default : []
  },
});
