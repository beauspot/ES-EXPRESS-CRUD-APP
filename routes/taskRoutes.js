import {
  getAllTasks,
  createTask,
  getASingleTask,
  editTask,
  deleteTask,
} from "../controllers/taskCtrls.js";
import express from "express";
const router = express.Router();

router.get("/getalltasks", getAllTasks);

router.post("/createtask", createTask);

router.get("/singletask/:id", getASingleTask);

router.patch("/edittasks/:id", editTask);

router.delete("/deletetasks/:id", deleteTask);

export default router;
