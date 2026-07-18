import express from "express";

import healthRouter from "./routes/health.route.js";
import notFound from "./middleware/errorHandler.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/health", healthRouter);

// Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
