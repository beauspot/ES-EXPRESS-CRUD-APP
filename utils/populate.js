import dotenv from "dotenv";
dotenv.config();

import connectDB from "../db/dbconfig.js";
import taskModel from "../model/taskModel.js";

import task from "../taskDB.js";

const populateDB = async () => {
  try {
    await connectDB(
      "mongodb+srv://beauspot:b1058019@nodeexpressprojects.lsjtpyb.mongodb.net/ES6_CRUD_DEV?retryWrites=true&w=majority"
    );
    await taskModel.deleteMany();
    await taskModel.create(task);
    console.log("Successfully connected to the database");
    process.exit(0);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
};

populateDB();
