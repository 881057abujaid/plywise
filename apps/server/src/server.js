import app from "./app.js";
import env from "./config/env.js";
import connectDatabase from "./config/database.js";

const startServer = async () => {
  try {
    await connectDatabase(env.mongoUri);

    app.listen(env.port, () => {
      console.log(`PlyWise server is running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start PlyWise server: ", error.message);
    process.exit(1);
  }
};

startServer();
