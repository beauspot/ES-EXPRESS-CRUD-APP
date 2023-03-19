import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please an email address is mandatory."],
      unique: [true, "This email address is currently in use"],
      lowercase: true,
      trim: true,
      maxlength: 100,
      minlength: 25,
    },
    username: {
      type: String,
      required: [true, "The username is required"],
      unique: [true, "This username is already in use"],
      trim: true,
      lowercase: true,
      maxlength: 17,
      minlength: 10,
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: 20,
      maxlength: 30,
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.generateAuthToken = async () => {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
};
