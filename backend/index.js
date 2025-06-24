import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import AuthenticationRoutes from "./routes/Authentication.js";
import adminRoutes from "./routes/AdminRoutes.js";
import summaryRoutes from "./routes/SummaryRoutes.js";
import connectdb from "./config/connectdb.js";
import cookieParser from "cookie-parser";
import redis from "./config/client.js";
import errorHandlerl from "./middlewares/errorHandler.js";
import { deactivateInactiveUsers } from "./utils/cron/inactiveUserCron.js";

const app = express();

// load configs
dotenv.config({});
connectdb();
deactivateInactiveUsers();

app.use(
  cors({
    origin: process.env.ORIGIN || "https://smartbrief-ai.vercel.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/auth/user", AuthenticationRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/summary", summaryRoutes);

app.use(errorHandlerl);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Serving is running on port: ${PORT}`);
});
