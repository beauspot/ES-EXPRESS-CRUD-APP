export const authenticateMiddleware = (req, res, next) => {
  if (req.session.isAuth) {
    next();
  } else {
    req.session.error = "You have to Login first";
    res.status(401).json({ message: "You aren't authenticated" });
  }
};
