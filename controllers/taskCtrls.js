import taskModel from "../model/taskModel.js";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";

const getAllTasks = asyncHandler(async (req, res, next) => {
  const getAllTasks = await taskModel.find();
  if (getAllTasks.length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ ErrorMessage: "No tasks Available." });
  } else {
    return res.status(StatusCodes.OK).json({
      length: getAllTasks.length,
      status: StatusCodes.OK,
      taskData: getAllTasks,
    });
  }
});

const createTask = asyncHandler(async (req, res, next) => {
  // run a validation on the create task ctrler
  const createTask = await taskModel.create(req.body);
  res.status(StatusCodes.OK).json({ createTask });
});

const getASingleTask = asyncHandler(async (req, res, next) => {
  const { id: taskID } = req.params;
  const singleTask = await taskModel.findOne({ _id: taskID });
  if (!singleTask) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: `Task with ${taskID} does not exist` });
  } else {
    res
      .status(StatusCodes.OK)
      .json({ status: StatusCodes.OK, taskData: singleTask });
  }
});

const editTask = asyncHandler(async (req, res, next) => {
  const { id: taskID } = req.params;
  const updateTask = await taskModel.findOneAndUpdate(
    { _id: taskID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateTask) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json("ErrorMessage: The task ID isn't correct. Please Check the ID.");
  } else {
    res
      .status(StatusCodes.OK)
      .json({ status: "Updated Successfully", taskData: updateTask });
  }
});

const deleteTask = asyncHandler(async (req, res, next) => {
  const { id: taskID } = req.params;
  const deleteTask = await taskModel.findOneAndDelete({ _id: taskID });
  if (!deleteTask) {
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ ErrorMessage: `The task with the Id: ${taskID} does not exist` });
  } else {
    res
      .status(StatusCodes.OK)
      .json({ status: "Deleted Successfully", taskData: deleteTask });
  }
});

export { getAllTasks, createTask, getASingleTask, editTask, deleteTask };
