import mongoose from "mongoose";

const interestedUserSchema = new mongoose.Schema({
  userid: String,
  email: String,
  userName: String,
});



const teamSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  authorId : String,
  authorName: String,
  teamSize: Number,
  teamVacancies: Number,
  skillsRequired: [String],
  positions: [String],
  hackathonName: String,
  postedDate: Date,
  expires: Date,
  teamDescription: String,
  projectDescription: String,
  coverImg: String,
  interestedCandidates: {
    type: [interestedUserSchema],
  },
});

export default teamSchema;
