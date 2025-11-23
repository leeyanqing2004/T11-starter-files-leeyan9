import express from "express";
import routes from "./routes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

// TODO: complete me (loading the necessary packages)

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

var corsOptions = {
    origin: FRONTEND_URL,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

const app = express();

// TODO: complete me (CORS)
app.use(cors(corsOptions))
app.use(express.json());
app.use('', routes);

export default app;