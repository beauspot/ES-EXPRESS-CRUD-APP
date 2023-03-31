import mongoose from "mongoose";

const connectDB = async (url) => {
  try {
    await mongoose.connect(url);
    console.info({ dbMessage: `Connected to the Database!` });
  } catch (error) {
    console.error({ dbMessage: error.message });
  }
};

export default connectDB;
