import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
dotenv.config();

mongoose
  .connect(process.env.MONGO_DB)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log("Error : ", err);
  });

const app = express();
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send(`<h1>Hello Node js, welcome to a new project</h1>`);
// });

app.listen(3000, () => {
  console.log("Server listening to port 3000");
});

app.use("/api/user", userRoute);
app.use("/api/auth", authRoutes);
