import authModel from "../model/authModel.js";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { mailer } from "../config/nodeMailer.js";

dotenv.config();

export const createUser = async (req, res, next) => {
  const newUser = await authModel.create({ ...req.body });
  const userToken = newUser.createJWT();

  // send a welcome email to the user
  const mail = newUser.email;
  const Subject = "Welcome to Task API";
  const text = "This is task API try it to keep ahead of your tasks";

  mailer(mail, Subject, text);

  return res
    .status(StatusCodes.CREATED)
    .json({ UserData: { userName: newUser.username }, token: userToken });
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ errMessage: `All Fields Are Mandatory` });
  }

  const userExists = await authModel.findOne({ email });

  if (!userExists) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errMessage: `The user with the email: ${email} is not registered`,
    });
  }

  // comparing the user pwds
  const isMatch = await userExists.comparePwd(password);
  console.log(isMatch);

  if (!isMatch) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      errMessage: `Authentication Error for email: ${email}`,
    });
  } else {
    const usertoken = userExists.createJWT();
    return res.status(StatusCodes.OK).json({
      userDate: { userEmail: userExists.email },
      Token: usertoken,
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
