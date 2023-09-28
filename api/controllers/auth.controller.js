import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 12);
  const user = new User({ username, email, password: hashedPassword });
  //   await user.save();
  //   res.status(201).json({ message: "User created successfully" });
  //   console.log(req.body);
  try {
    await user.save();
    res.status(201).json({ message: "User created successfully" });
    console.log(req.body);
  } catch (error) {
    //res.status(500).json(error.message);
    next(error);
  }
};
