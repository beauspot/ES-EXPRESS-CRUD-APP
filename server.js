// external dependencies
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import sessions from "express-session";
import mongoSanitize from "express-mongo-sanitize";
import { StatusCodes } from "http-status-codes";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import logger from "morgan";

// module dependencies
import connectDB from "./db/dbconfig.js";
import taskRoute from "./routes/taskRoutes.js";
import authRoute from "./routes/authRoute.js";

// middlewares
import __404_err_page from "./middlewares/notfound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middleware functions
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(
  sessions({
    resave: true,
    saveUninitialized: true,
    secret: true,
    cookie: { maxAge: 60000 },
    secret: process.env.SESSION_SECRET_KEY,
  })
);

// routes middlewares
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/auth", authRoute);

app.get("/", (req, res, next) => {
  res
    .status(StatusCodes.PERMANENT_REDIRECT)
    .redirect("/api/v1/auth/createacct");
});

app.use(errorHandlerMiddleware);
app.use("*", __404_err_page);

const Port = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(Port, () =>
      console.info(`Server listening on http:\//localhost:${Port}`)
    );
  } catch (err) {
    console.error(err.message);
  }
};

startServer();
