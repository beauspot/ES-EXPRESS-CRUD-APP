import mongoose from "mongoose";

const nigeriaOffset = 60 * 60 * 1000 * 1;

// defining the schema
const TaskSchema = new mongoose.Schema(
  {
    // creating an association between the auth Model and the task Model
    author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "AuthModel",
    },
    taskname: {
      type: String,
      required: [true, "Please provide a task name"],
      trim: true,
      maxlength: 50,
      minlength: 10,
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

const taskModel = mongoose.model("TaskModel", TaskSchema);
export default taskModel;
