import mongoose from "mongoose";

export const hackathonSchema = mongoose.Schema({
    name:String,
    cover_photo:String,
    Organisation : String,
    startDate:Date,
    endDate:Date,
    status:String,
    location:String,
    description:String,
    officialUrl:String,
})
