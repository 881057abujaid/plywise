import express from "express";

import healthRouter from "./routes/health.route.js";
import notFound from "./middleware/errorHandler.js";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import playerRoutes from "./routes/player.routes.js";

const app = express();

// Middlewares
app.use(express.json());

// Routes
app.use("/api/v1/health", healthRouter);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/players", playerRoutes);

// Not Found Handler
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

export default app;
