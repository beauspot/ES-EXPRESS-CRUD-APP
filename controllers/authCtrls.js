import authModel from "../model/authModel.js";
import { StatusCodes } from "http-status-codes";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";
import dotenv from "dotenv";
import { mailer } from "../config/nodeMailer.js";
import UnauthenticatedError from "../errors/unauthenticated.js";

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
  console.log(isMatch); // returns a boolean

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
  // Use the authentication middleware to ensure that the user is authenticated
  authenticateMiddleware(req, res, () => {});

  // Retrieve the token from the Authorization header.
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("User authentication failed.");
  }

  const token = authHeader.split(" ")[1];

  // check if token exists
  if (!req.user) {
    throw new Error("req.user is undefined");
  }

  // Remove the token from the user's token array and save the changes
      req.user.tokens = req.user.tokens.filter((t) => t.token !== token);
      await req.user.save();

  res.send("User logged out successfully");
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
