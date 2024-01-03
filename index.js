import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import userRouter from "./routes/usersRouter.js";
import teamsRouter from "./routes/teamsRouter.js";
import hackathonRouter from "./routes/hackathonRouter.js";
import memberRouter from "./routes/memberRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(helmet());

// Router middleware
app.use("/user", userRouter);
app.use("/teams", teamsRouter);
app.use("/hackathons", hackathonRouter);
app.use("/member", memberRouter);


mongoose
  .connect(process.env.mongo_connection_id)
  .then(() => console.log("connected to db successfully"))
  .catch((err) => console.log("connection to db failed", err));

app.get("/", (req, res) => {
  res.status(200).send("hello connect");
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server started on port 5000");
});
