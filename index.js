import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

import userSchema from "./schemas/user.js";
import hackathonSchema from "./schemas/hackathon.js";
import teamSchema from "./schemas/team.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const saltRounds = 10;

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.mongo_connection_id)
  .then(() => console.log("connected to db successfully"))
  .catch((err) => console.log("connection to db failed", err));

app.get("/", (req, res) => {
  res.status(200).send("hello connect");
});

app.post("/signup", (req, res) => {
  console.log("signup request");
  const { name, email, password } = req.body;

  bcrypt.hash(password, saltRounds, function (err, hash) {
    console.log(password,saltRounds);
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

app.post("/login", async (req, res) => {
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

app.get("/user/:id", async (req, res) => {
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

app.put("/teams", (req, res) => {
  console.log("teams request");
  console.log(req.body);
  const { teamId, userId, email, userName } = req.body;
  console.log(teamId, userId, email);
  console.log(userName);
  const Team = mongoose.model("Team", teamSchema);
  Team.findOneAndUpdate(
    { _id: teamId },
    {
      $push: {
        interestedCandidates: {
          userid: userId,
          email: email,
          userName: userName,
        },
      },
    },
    { new: true }
  )
    .then((data) => {
      console.log(data);
      console.log("team found and updated");
      res.status(200).send({ message: "success", data: data });
    })
    .catch((err) => {
      console.log("team not found", err);
      res.status(400).send({ message: "team not found" });
    });
});

app.post("/userUpdate", (req, res) => {
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
      res.status(200).send({ message: "success", data: data });
    })
    .catch((err) => {
      console.log("user update failed", err);
      res.status(400).send({ message: "user update failed" });
    });
});

app.post("/newTeam", (req, res) => {
  const { team, userId } = req.body;
  const {
    name,
    hackathonName,
    skillsRequired,
    positions,
    teamSize,
    teamVacancies,
    teamDescription,
    projectDescription,
    userName,
  } = team;
  const Team = mongoose.model("Team", teamSchema);
  const newTeam = new Team({
    name,
    authorId: userId,
    authorName: userName,
    teamSize,
    teamVacancies,
    hackathonName,
    postedDate: new Date(),
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    skillsRequired,
    positions,
    teamDescription,
    projectDescription,
    coverImg: "",
    interestedCandidates: [],
  });
  newTeam
    .save()
    .then((data) => {
      console.log("team created successfully");
      res.status(200).send({ message: "success", data: data });
    })
    .catch((err) => {
      console.log("team creation failed", err);
      res.status(400).send({ message: "team creation failed" });
    });
});

app.get("/hackathons", (req, res) => {
  console.log("hackathon request");
  const Hackathon = mongoose.model("Hackathon", hackathonSchema);
  Hackathon.find({})
    .then((data) => {
      console.log("hackathons found");
      res.status(200).send({ message: "success", data: data });
    })
    .catch((err) => {
      console.log("hackathons not found", err);
      res.status(400).send({ message: "hackathons not found" });
    });
});

app.get("/teams", (req, res) => {
  console.log("all teams request");
  const Team = mongoose.model("Team", teamSchema);
  Team.find({})
    .then((data) => {
      console.log("teams found");
      res.status(200).send({ message: "success", data: data });
    })
    .catch((err) => {
      console.log("teams not found", err);
      res.status(400).send({ message: "teams not found" });
    });
});

app.get("/user/myTeams/:authorId", (req, res) => {
  const { authorId } = req.params;
  const Team = mongoose.model("Team", teamSchema);
  Team.find({ authorId: authorId })
    .then((teams) => {
      res.status(200).send(teams);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({ message: "Error fetching teams" });
    });
});

app.get("/member/:id", (req, res) => {
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

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port 5000");
});
