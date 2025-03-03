import express from "express";
import morgan from "morgan";
import cors from "cors";

import config from "./config/config.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";
import { db_connection_check } from "./helpers/db_sync.js";

db_connection_check();

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use(express.static("public"));
app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(config.PORT, () => {
  console.log(
    `Server is running. Use our API on port: ${config.PORT}\
    \nhttp://localhost:${config.PORT}`
  );
});
