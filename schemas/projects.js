import mongoose from "mongoose";

export const projectSchema = mongoose.Schema({
  name: {
    type: String,
  },
  description: String,
  url: String,
});
