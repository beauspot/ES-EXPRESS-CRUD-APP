import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";

/* export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "The User is not authenticated" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { userId: decodedToken.userId };
  next();
}; */

export const authMiddleware = asyncHandler((req, res, next) => {
  const token = req.cookies.token;
  console.log(token);
  if (token) {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log(`User in authmiddleware: ${user}`);
    console.log(user);
    req.user = user;
    next();
  } else {
    return res.status(401).json({ message: "The User is not authenticated" });
  }
});

export const authorizeMiddleware = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: "Forbidden" });
    }
    next();
  };
};
