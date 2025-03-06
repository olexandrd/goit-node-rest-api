import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import ctrlWrapper from "../helpers/controllerWrapper.js";
import { authenticate } from "../middleware/jwt.js";

import {
  createContactSchema,
  updateContactFavoriteSchema,
  updateContactSchema,
} from "../schemas/contactsSchemas.js";

import validateBody from "../middleware/validateBody.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, ctrlWrapper(getAllContacts));

contactsRouter.get("/:id", authenticate, ctrlWrapper(getOneContact));

contactsRouter.delete("/:id", authenticate, ctrlWrapper(deleteContact));

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  ctrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  validateBody(updateContactFavoriteSchema),
  ctrlWrapper(updateStatusContact)
);
export default contactsRouter;
