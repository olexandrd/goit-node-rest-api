import { Sequelize } from "sequelize";
import config from "../config/config.js";

export const sequelize = new Sequelize(config.DB_URI, {
  logging: false,
  define: {
    timestamps: false,
  },
});
