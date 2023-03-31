import {
  getAllTasks,
  createTask,
  getASingleTask,
  editTask,
  deleteTask,
} from "../controllers/taskCtrls.js";
import express from "express";
import { validateTask } from "../middlewares/validate.js";
import { authenticateMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authenticateMiddleware);

router.get("/getalltasks", getAllTasks);

router.post("/createtask", validateTask, createTask);

router.get("/singletask/:id", getASingleTask);

router.patch("/edittasks/:id", editTask);

router.delete("/deletetasks/:id", deleteTask);

export default router;
