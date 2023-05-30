// external dependencies
import "express-async-errors";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import { StatusCodes } from "http-status-codes";
import MongodbSession from "connect-mongodb-session";
import cookieParser from "cookie-parser";
import session from "express-session";
import dotenv from "dotenv";
import logger from "morgan";

// Your code here

// module dependencies
import connectDB from "./config/dbconfig.js";
import taskRoute from "./routes/taskRoutes.js";
import authRoute from "./routes/authRoute.js";
// import swaggerUisetup from "./config/swaggerUIconf.js";

// middlewares
import __404_err_page from "./middlewares/notfound.js";
import errorHandlerMiddleware from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();
const MongoDBStore = MongodbSession(session);
const store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "Sessions-Collection",
  ttl: 60 * 60, // session will expire in 1hr
});
// Middleware functions
app.use(xss());
app.use(cors());
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(mongoSanitize());
app.use(cookieParser());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
app.use(
  session({
    resave: false,
    secret: process.env.SESSION_SECRET_KEY,
    saveUninitialized: false,
    store: store,
    cookie: {
      sameSite: "strict",
      secure: false, // use true if using https
      maxAge: 1000 * 60 * 60, // cookie would expire in 1 hour
    },
  })
);

// routes middlewares
app.use("/api/v1/tasks", taskRoute);
app.use("/api/v1/auth", authRoute);

//app.use("/api/v1/docs", ...swaggerUisetup());

app.get("/", (req, res, next) => {
  req.session.isAuth = true;
  console.log(req.session);
  console.log(req.session.id);
  res
    .status(StatusCodes.PERMANENT_REDIRECT)
    .json({ message: "Welcome to the task rest api application." });
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
    process.exit(1);
  }
};

startServer();
