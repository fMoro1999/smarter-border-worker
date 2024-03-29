import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import { router } from "./routes/todos";

export const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const isDevMode = (process.env["ENVIRONMENT"] ?? "dev") !== "prod";
if (!isDevMode) {
  app.use(express.static(path.join(__dirname, "..", "public/browser")));
}

// Routes
app.use("/todos", router);
