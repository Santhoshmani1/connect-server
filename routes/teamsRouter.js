import { Router } from "express";
import mongoose from "mongoose";
import teamSchema from "../schemas/team.js";

const teamsRouter = Router();

teamsRouter.get("/", (req, res) => {
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

teamsRouter.get("/myteams/:authorId", (req, res) => {
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

teamsRouter.post("/", (req, res) => {
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
      res.status(200).send({ message: "success" });
    })
    .catch((err) => {
      console.log("team creation failed", err);
      res.status(400).send({ message: "team creation failed" });
    });
});

teamsRouter.put("/", (req, res) => {
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

export default teamsRouter;
