import express, { Express } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import userRouter from "./routes/userRoutes";
import { ErrorMiddleware } from "./middleware/error";

const startBackend = async () => {
  const app: Express = express();
  app.use(express.json());

  const apiServerPort = process.env.API_SERVER_PORT || 8000;

  app.use("/api/user", userRouter);
  app.use(ErrorMiddleware.notFoundHandler);
  app.use(ErrorMiddleware.errorHandler);

  app.listen(apiServerPort, () => {
    console.log(
      `[server]: Server is running at http://localhost:${apiServerPort}`
    );
  });

  const dbServerPort = process.env.DB_SERVER_PORT;
  const dbName = process.env.DB_NAME;
  const dbServerUrl = process.env.DB_SERVER_URL;

  const dbConnectionString = dbServerUrl + ":" + dbServerPort + "/" + dbName;

  await mongoose.connect(dbConnectionString);
  console.log("DB Server started at port no: " + dbServerPort);
};

startBackend();
