import mongoose from "mongoose";
import { projectSchema } from "./projects.js";
import { postsSchema } from "./posts.js";

const userSchema = mongoose.Schema({
  name: String,
  email: {
    type: "String",
    unique: true,
  },
  password: String,
  skills: [String],
  projects: [projectSchema],
  about: {
    type: "String",
    default: "",
  },
  profilePic: {
    type: "String",
    default: "",
  },
  posts: {
    type : [postsSchema],
    default : []
  },
  github: {
    type: "String",
    default: "",
  },
  twitter: {
    type: "String",
    default: "",
  },
  linkedin: {
    type: "String",
    default: "",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default userSchema;
