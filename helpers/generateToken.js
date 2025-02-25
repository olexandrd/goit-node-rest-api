import jwt from "jsonwebtoken";
import config from "../config/config.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const verifyToken = (token) => {
  try {
    const result = jwt.verify(token, config.JWT_SECRET);
    return result;
  } catch (error) {
    console.log(error.message);
    return null;
  }
};
