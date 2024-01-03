import { Router } from "express";
import mongoose from "mongoose";
import hackathonSchema from "../schemas/hackathon.js";

const hackathonRouter = Router();

hackathonRouter.get("/", (req, res) => {
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

export default hackathonRouter;
