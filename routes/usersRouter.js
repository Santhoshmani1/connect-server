import { Router } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import userSchema from "../schemas/user.js";

const userRouter = Router();

userRouter.post("/signup", (req, res) => {
  const saltRounds = 10;
  console.log("signup request");
  const { name, email, password } = req.body;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(password, saltRounds);
    if (err) {
      console.log("Error hashing password", err);
      return res.status(500).send({ message: "Error hashing password" });
    }

    const User = mongoose.model("User", userSchema);
    const newUser = new User({
      name,
      email,
      password: hash,
      skills: [],
      projects: [],
      posts: [],
      createdAt: new Date(),
    });

    newUser
      .save()
      .then((data) => {
        console.log("user created successfully");
        const userId = String(data._id);
        res.status(200).send({ message: "success", userId: userId });
      })
      .catch((err) => {
        console.log("user creation failed", err);
        res.status(400).send({ message: "user creation failed" });
      });
  });
});

userRouter.post("/login", async (req, res) => {
  console.log("login");
  const { email, password } = req.body;
  console.log(req.body);
  const User = mongoose.model("User", userSchema);
  try {
    const userStatus = await User.findOne({ email });
    if (userStatus) {
      bcrypt.compare(password, userStatus.password, function (err, result) {
        if (err) {
          console.log("Error comparing passwords", err);
          return res.status(500).send({ message: "Error comparing passwords" });
        }
        if (result) {
          res.status(200).send({ message: "success", userStatus });
          console.log("user found", userStatus);
        } else {
          res.status(400).send({ message: "incorrect-password" });
        }
      });
    } else {
      res.status(400).send({ message: "User not found" });
    }
  } catch (err) {
    console.log("login failed", err);
    res.status(400).send({ message: "User not found" });
  }
});

userRouter.get("/:id", (req, res) => {
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

userRouter.put("/", (req, res) => {
  console.log("user update request");
  const { userId, updatedUserDetails } = req.body;
  const { name, email, github, twitter, linkedin, about, profilePic, skills } =
    updatedUserDetails;
  const User = mongoose.model("User", userSchema);
  User.updateOne(
    { _id: userId },
    {
      $set: {
        name: name,
        email: email,
        github: github,
        twitter: twitter,
        linkedin: linkedin,
        about: about,
        profilePic: profilePic,
        skills: skills,
      },
    }
  )
    .then((data) => {
      console.log("user updated");
      res.status(200).send({ message: "success" });
    })
    .catch((err) => {
      console.log("user update failed", err);
      res.status(400).send({ message: "user update failed" });
    });
});

export default userRouter;
