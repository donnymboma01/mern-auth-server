import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

import { errorHandler } from "../utils/errors.js";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user_exists = await User.findOne({ email });
    if (!user_exists) {
      return next(errorHandler(404, "User not found"));
    }

    const validPassword = await bcryptjs.compareSync(
      password,
      user_exists.password
    );
    if (!validPassword) return next(errorHandler(401, "wrong credentials"));
    const token = jwt.sign({ id: user_exists._id }, process.env.SECRET_TOKEN, {
      expiresIn: "1d",
    });

    const { password: hashedPassword, ...rest } = user_exists._doc;
    const expireDate = new Date(Date.now() + 360000); // 1hr
    res
      .cookie("access_token", token, { httpOnly: true, expires: expireDate })
      .status(200)
      .json({ user: user_exists, token });
  } catch (error) {
    next(error);
  }
};
