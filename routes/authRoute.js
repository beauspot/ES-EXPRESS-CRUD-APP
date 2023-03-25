import {
  createUser,
  loginUser,
  logoutUser,
  logoffUser,
} from "../controllers/authCtrls.js";
import { validateRegistration } from "../middlewares/validate.js";
import express from "express";
const router = express.Router();

router.post("/createacct", validateRegistration, createUser);

router.post("/loginacct", loginUser);

router.post("/logoutacct", logoutUser);

router.delete("/logoffacct", logoffUser);

export default router;
