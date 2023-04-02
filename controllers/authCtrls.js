import authModel from "../model/authModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { mailer } from "../config/nodeMailer.js";

dotenv.config();

export const createUser = async (req, res, next) => {
  const { email, username, password } = req.body;
  if (!email || !username || !password) {
    return res.status(400).send("All fields are mandatory ");
  }

  // check if the user already exists
  const existingUser = await authModel.findOne({ username });
  if (existingUser) {
    return res
      .status(StatusCodes.CONFLICT)
      .json({ errorMessage: "Username is already taken" });
  }
  // hash the password.
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new authModel({
    email,
    username,
    password: hashedPassword,
  });
  console.log(newUser);
  await newUser.save(); // save user to database

  // send a welcome email to the user
  const mail = email;
  const Subject = "Welcome to Task API";
  const text = "This is task API try it to keep ahead of your tasks";

  mailer(mail, Subject, text);

  return res.status(StatusCodes.CREATED).json({
    message: `The User with the username ${username}, and email ${email} has been registered Successfully`,
  });
};

export const loginUser = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errMessage: `All Fields Are Mandatory` });
  }

  const userExists = await authModel.findOne({ username });

  if (!userExists) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errMessage: `The user with the username: ${username} is not registered`,
    });
  }

  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errMessage: `Authentication Error for username: ${username}`,
    });
  } else {
    req.session.isAuth = true;
    return res.status(StatusCodes.OK).json({
      message: `The user with the username: ${username} is logged in`,
    });
  }
};

export const logoutUser = async (req, res, next) => {
  await req.session.destroy((err) => {
    if (err) {
      return res.status(403).json({ errorMesage: err.message });
    }
    res
      .status(StatusCodes.OK)
      .clearCookie("sessionId")
      .json({ message: "Logout successful" });
  });
};

export const logoffUser = async (req, res, next) => {
  const { username } = req.body;
  await authModel.findByIdAndDelete(username);
  res.sendStatus(204);
};

/** createUser,
  loginUser,
  logoutUser,
  logoffUser, */

// export const createUser =
