import { createUser, loginUser, adminify } from "../controllers/authCtrls.js";
import { validateRegistration } from "../middlewares/validate.js";

import { auth } from "../middlewares/authMiddleware.js";
import express from "express";
const router = express.Router();

router.use(auth);

router.post("/createacct", validateRegistration, createUser);

router.post("/loginacct", loginUser);

router.post("/adminuser", adminify);

export default router;
