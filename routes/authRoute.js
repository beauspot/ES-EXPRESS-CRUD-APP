import {
  createUser,
  loginUser,
  logoutUser,
  logoffUser,
} from "../controllers/authCtrls.js";
import express from "express";
const router = express.Router();

router.post("/createacct", createUser);

router.post("/loginacct", loginUser);

router.post("/logoutacct", logoutUser);

router.delete("/logoffacct", logoffUser);

export default router;
