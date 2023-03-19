import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const nigeriaOffset = 60 * 60 * 1000 * 1;

// defining the schema
const TaskSchema = new mongoose.Schema(
  {
    task_name: {
      type: String,
      required: [true, "Please provide a task name"],
      trim: true,
      maxlength: 255,
      minlength: 100,
    },

    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { currentTime: () => Date.now() + nigeriaOffset },
    versionKey: false,
  }
);

const taskModel = mongoose.model('TaskModel', TaskSchema);
export default taskModel;