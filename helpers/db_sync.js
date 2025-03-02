import { Contact } from "../models/Contact.js";
import { User } from "../models/User.js";
import { sequelize } from "../config/db.js";

export const db_sync = async () =>
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection successful.");
      User.sync({ alter: true });
      Contact.sync({ alter: true });
      console.log("Models were synchronized successfully.");
    })
    .catch((error) => {
      console.log("Database connection failed.", error);
      process.exit(1);
    });

export const db_check = async () =>
  sequelize
    .authenticate()
    .then(() => {
      console.log("Database connection successful.");
    })
    .catch((error) => {
      console.log("Database connection failed.", error);
      process.exit(1);
    });
