import authModel from "../model/authModel.js";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import sgMail from "@sendgrid/mail";

dotenv.config();
sgMail.setApiKey(
  "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"
);

const createUser = async (req, res, next) => {
  const { email, password, username } = req.body;
  const existingUser = await authModel.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new authModel({ email, username, password: hashedPassword });
  console.log(newUser);
  await newUser.save();

  // send a welcome email to the user
  const msg = {
    to: req.body.email,
    from: "beauspot@outlook.com",
    subject: "Welcome to the Task Manager Api community!",
    text: "Thank you for signing up for our service. As a new member of the Octave community, we invite you to become a full-fledged Task manager community and enjoy all the benefits of our service.",
  };
  await sgMail.send(msg);
  res.status(StatusCodes.CREATED).json({
    message: `The User with the username ${username}, and email ${email} has been registered Successfully`,
  });
};

const loginUser = async (req, res, next) => {
  const { username, password } = req.body;
  const existingUser = await authModel.findOne({ username });

  // checks if the user exists
  if (!existingUser) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: `The User with the username ${username} does not exist.`,
    });
  }
  const isPasswordMatch = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordMatch) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: `Invalid username or Password` });
    return;
  }
  const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });

  res
    .cookie("refreshToken", process.env.REFRESH_TOKEN, {
      httpOnly: true,
      path: "/api/v1/auth/loginacct",
      expiresIn: 7 * 24 * 60 * 60 * 1000, // Set the expiration time to one week
    })
    .json({ JWT_TOKEN: token });
};

const logoutUser = async (req, res, next) => {
  const { username } = req.body;
  res.clearCookie("refreshToken", { path: "/api/v1/auth/logoutacct" });
  res
    .status(StatusCodes.OK)
    .json({ message: `The user ${username} is logged out successfully.` });
};

const logoffUser = async (req, res, next) => {
  const { username } = req.body;
  await authModel.findOneAndDelete(username);
  res.status(StatusCodes.ACCEPTED).json({
    message: `The User ${username} has successfully deleted his or her account`,
  });
};

export { createUser, logoutUser, logoffUser, loginUser };
