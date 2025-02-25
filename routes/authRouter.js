import express from "express";

import ctrlWrapper from "../helpers/controllerWrapper.js";

import validateBody from "../helpers/validateBody.js";
import { register, login } from "../controllers/authControllers.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(register)
);

authRouter.post("/login", validateBody(loginSchema), ctrlWrapper(login));
export default authRouter;
