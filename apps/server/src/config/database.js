import mongoose from "mongoose";

const connectDatabase = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error("MONGO_URI is not defined");
  }

  await mongoose.connect(mongoUri);

  console.log("MongoDB connected successfully");
};

export default connectDatabase;
