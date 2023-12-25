import mongoose from "mongoose";

export const commentSchema = mongoose.Schema({
    author:String,
    body:String,
    default:[]
})