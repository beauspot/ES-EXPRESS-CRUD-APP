import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please an email address is mandatory."],
    unique: [true, "This email address is currently in use"],
    lowercase: true,
    trim: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    maxlength: 17,
    minlength: 8,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 500,
  },
});

// <========== Mongoose Middleware =========>

// for the moment user registers
// the password is ran through a bcrypt function
userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//<==========Schema Instance Methods============>

// generate token
userSchema.methods.createJWT = function () {
  return jwt.sign(
    {
      userId: this._id,
      name: this.username,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXP }
  );
};

userSchema.methods.comparePwd = async function (pwd) {
  const comparePwd = await bcrypt.compare(pwd, this.password);
  console.log(comparePwd);
  return comparePwd;
};

const authModel = mongoose.model("authmodels", userSchema);
export default authModel;
