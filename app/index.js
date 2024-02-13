import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import cors from "cors";
import router from "./routes/routes.js";
import "dotenv/config";

const app = express();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors(corsOptions));

app.use("/api/v1/manifests", router);

// MongoDB connection
const { CONNECTION_STRING } = process.env;

mongoose.set("strictQuery", true);

async function main() {
  await mongoose.connect(CONNECTION_STRING);
}

main().catch((error) => {
  console.log(error);
});

export default app;
