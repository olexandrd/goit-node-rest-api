import express from "express";

import ctrlWrapper from "../helpers/controllerWrapper.js";

import validateBody from "../middleware/validateBody.js";
import {
  register,
  login,
  getCurrent,
  logout,
  subscription,
  updateAvatar,
  verifyEmail,
} from "../controllers/authControllers.js";
import {
  emailVerificationSchema,
  loginSchema,
  registerSchema,
  subscriptionSchema,
} from "../schemas/authSchemas.js";
import { authenticate } from "../middleware/jwt.js";
import { upload } from "../middleware/storage.js";

const authRouter = express.Router();

authRouter.post(
  "/register",
  validateBody(registerSchema),
  ctrlWrapper(register)
);

authRouter.post("/login", validateBody(loginSchema), ctrlWrapper(login));

authRouter.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));

authRouter.post("/verify", validateBody(emailVerificationSchema));

authRouter.get("/current", authenticate, ctrlWrapper(getCurrent));

authRouter.post("/logout", authenticate, ctrlWrapper(logout));

authRouter.patch(
  "/subscription",
  authenticate,
  validateBody(subscriptionSchema),
  ctrlWrapper(subscription)
);

authRouter.patch(
  "/avatar",
  authenticate,
  upload.single("avatar"),
  ctrlWrapper(updateAvatar)
);

export default authRouter;
