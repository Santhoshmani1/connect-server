import { Router } from "express";
import mongoose from "mongoose";
import userSchema from "../schemas/user.js";

const memberRouter = Router();

memberRouter.get("/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId);
  console.log(userId);
  const User = mongoose.model("User", userSchema);
  User.findOne({ _id: userId })
    .then((data) => {
      const {
        name,
        email,
        projects,
        github,
        twitter,
        linkedin,
        createdAt,
        about,
        profilePic,
        skills,
        _id,
      } = data;
      console.log("user found");
      const userDetails = {
        name: name,
        email: email,
        projects: projects,
        github: github,
        twitter: twitter,
        linkedin: linkedin,
        createdAt: createdAt,
        about: about,
        profilePic: profilePic,
        skills: skills,
        id: _id,
      };
      res.status(200).send({ message: "success", userDetails: userDetails });
    })
    .catch((err) => {
      console.log("user not found", err);
      res.status(400).send({ message: "user not found" });
    });
});

export default memberRouter;
