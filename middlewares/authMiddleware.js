// authorization and authentication middleware
import jwt from "jsonwebtoken";
import UnauthenticatedError from "../errors/unauthenticated.js";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

export const auth = asyncHandler(async (req, res, next) => {
  // check header or url parameters or post parameters for token
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer "))
    throw new UnauthenticatedError("User authentication failed.")

  const token = authHeader.split(" ")[1];

  const payload = jwt.verify(token, process.env.JWT_SECRET);
  console.log(payload);
  // attach the user request object
  // req.user = payload

  req.user = {
    userId: payload.userId,
    name: payload.name,
    role: payload.role,
  };
  next();
});

