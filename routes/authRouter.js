import express from "express";

import ctrlWrapper from "../helpers/controllerWrapper.js";

import validateBody from "../helpers/validateBody.js";
import {
  register,
  login,
  getCurrent,
  logout,
} from "../controllers/authControllers.js";
import { loginSchema, registerSchema } from "../schemas/authSchemas.js";
import { authenticate } from "../helpers/jwt.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(register)
);

authRouter.post("/login", validateBody(loginSchema), ctrlWrapper(login));

authRouter.get("/current", authenticate, ctrlWrapper(getCurrent));

authRouter.post("/logout", authenticate, ctrlWrapper(logout));

export default authRouter;
