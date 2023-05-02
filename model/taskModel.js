import mongoose from "mongoose";

const nigeriaOffset = 60 * 60 * 1000 * 1;

// defining the schema
const TaskSchema = new mongoose.Schema(
  {
    // creating an association between the auth Model and the task Model
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: "authModels",
    },
    taskname: {
      type: String,
      required: [true, "Please provide a task name"],
      trim: true,
      maxlength: 50,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      required: true,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "authModels",
    },
  },
  {
    timestamps: true,
  }
);

const taskModel = mongoose.model("TaskModel", TaskSchema);
export default taskModel;
