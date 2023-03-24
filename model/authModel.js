import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please an email address is mandatory."],
      unique: [true, "This email address is currently in use"],
      lowercase: true,
      trim: true,
      maxlength: 100,
      minlength: 18,
    },
    username: {
      type: String,
      required: [true, "The username is required"],
      unique: [true, "This username is already in use"],
      trim: true,
      lowercase: true,
      maxlength: 17,
      minlength: 8,
    },
    password: {
      type: String,
      required: [true, "The password is required"],
      minlength: 20,
      maxlength: 500,
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

//  generates a new JWT token for the user and saves it to the user's tokens array
userSchema.methods.generateAuthToken = async () => {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXP,
  });
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// generates a new JWT token for refreshing the authentication token.
userSchema.methods.generateRefreshToken = async () => {
  const user = this;
  const refreshToken = jwt.sign(
    { _id: user._id.toString() },
    process.env.REFRESH_TOKEN,
    { expiresIn: process.env.REF_EXP }
  );
};

// Takes a username and password as an arg & attempts to find a user in the db with the username.
userSchema.statics.findByCredentials = async (username, password) => {
  const user = await authModel.findOne({ username });
  if (!user) {
    throw new Error("Invalid Username or Password");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid Username or Password");
  }
  return user;
};

//  takes a username and password as arguments
//  and attempts to find a user in the database with that username
userSchema.pre("save", async (next) => {
  const user = this;
  if (user instanceof mongoose.Document && user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const authModel = mongoose.model("AuthModel", userSchema);
export default authModel;
