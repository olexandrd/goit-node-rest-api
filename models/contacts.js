import { Sequelize, DataTypes } from "sequelize";
import config from "../config/config.js";

export const sequelize = new Sequelize(config.POSTGRES_URI, {
  logging: false,
  define: {
    timestamps: false,
  },
});

export const Contact = sequelize.define("Contact", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  favorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});
