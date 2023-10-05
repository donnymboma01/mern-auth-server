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

// Auth with Google account.
export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 heure.
      res
        .cookie("access_token", token, { httpOnly: true, expiryDate })
        .status(200)
        .json(user);
    } else {
      const generatePassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatePassword, 12);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.floor(Math.random() * 10000).toString(),
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photoURL,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.SECRET_TOKEN);
      const { password: hashedPassword2, ...rest } = newUser._doc;

      const expiryDate = new Date(Date.now() + 3600000); // 1 heure.
      res
        .cookie("access_token", token, { httpOnly: true, expiryDate })
        .status(200)
        .json(newUser);
    }
  } catch (error) {
    next(error);
  }
};
