import taskModel from "../model/taskModel.js";
import { StatusCodes } from "http-status-codes";
import asyncHandler from "express-async-handler";
import Redis from "ioredis";
// import paginate from "express-paginate";
const redis = new Redis({
  host: process.env.REDIS_URL_HOST,
  port: process.env.REDIS_URL_PORT,
});

const getAllTasks = asyncHandler(async (req, res, next) => {
  // pagination begins here
  let page = parseInt(req.query.page) || 1;
  let pageSize = parseInt(req.query.pageSize) || 2;

  // calculate the number of documents to skip
  const skipPages = (page - 1) * pageSize;

  const getAlltasks = await taskModel.find().skip(skipPages).limit(pageSize);

  // calculate the total number of documents
  const count = await taskModel.countDocuments();

  const totalPages = Math.ceil(count / pageSize);

  if (getAlltasks.length === 0) {
    res
      .status(StatusCodes.BAD_REQUEST)
      .json({ ErrorMessage: "No tasks Available." });
  }
  const baseUrl = `${req.protocol}://${req.hostname}:${
    process.env.PORT || 3000
  }${req.baseUrl}`;

  let links = {};
  if (page > 1) {
    links.first = `${baseUrl}?page=1`;
    links.prev = `${baseUrl}?page=${page - 1}`;
  }
  if (page < totalPages) {
    links.next = `${baseUrl}?page=${page + 1}`;
    links.last = `${baseUrl}?page=${totalPages}`;
  }
  redis.set(getASingleTask, JSON.stringify(getASingleTask));
  return res.status(StatusCodes.OK).json({
    length: getAlltasks.length,
    status: StatusCodes.OK,
    taskData: getAlltasks,
    // pagination ends here
    pagination: {
      page,
      pageSize,
      totalPages,
      totalItems: count,
      links,
    },
  });
});

const createTask = asyncHandler(async (req, res, next) => {
  // run a validation on the create task ctrler
  const createTask = await taskModel.create(req.body);
  redis.set(createTask, JSON.stringify(createTask));
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
    redis.set(taskID, JSON.stringify(singleTask));
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
    redis.set(updateTask, JSON.stringify(updateTask));
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
    redis.set(deleteTask, JSON.stringify(deleteTask));
    res
      .status(StatusCodes.OK)
      .json({ status: "Deleted Successfully", taskData: deleteTask });
  }
});

export { getAllTasks, createTask, getASingleTask, editTask, deleteTask };
