import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "The User is not authenticated" });
  }

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  req.user = { userId: decodedToken.userId };
  next();
};
