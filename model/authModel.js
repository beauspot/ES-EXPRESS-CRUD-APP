import mongoose from "mongoose";
// import bcrypt from "bcrypt";

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
    minlength: 20,
    maxlength: 500,
  },
});

/* userSchema.pre("save", async function () {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});
 */
const authModel = mongoose.model("authmodels", userSchema);
export default authModel;
