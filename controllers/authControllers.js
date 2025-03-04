import path from "path";
import fs from "fs/promises";
import authServices from "../services/authServices.js";
import config from "../config/config.js";
import s3_upload from "../helpers/s3_uploader.js";
import HttpError from "../helpers/HttpError.js";

const uploadDir = path.join(process.cwd(), "temp");
const avatarDir = "avatars";
const storeImage = path.join(process.cwd(), "public", avatarDir);

export const register = async (req, res, next) => {
  const result = await authServices.register(req.body);
  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
};

export const login = async (req, res, next) => {
  const result = await authServices.login(req.body);
  res.json(result);
};

export const getCurrent = async (req, res) => {
  res.json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

export const logout = async (req, res) => {
  const { email } = req.user;
  await authServices.logout(email);
  res.status(204).send();
};

export const subscription = async (req, res) => {
  const { email } = req.user;
  const result = await authServices.subscription(email, req.body);
  res.json({
    email: result.email,
    subscription: result.subscription,
  });
};

export const updateAvatar = async (req, res) => {
  const { email } = req.user;
  const { filename, mimetype } = req.file;
  if (!mimetype.includes("image")) {
    await fs.unlink(req.file.path);
    return next(HttpError(400, "Wrong file format"));
  }
  const tempPath = path.join(uploadDir, filename);
  const emailString = req.user.email.replace(/[^a-zA-Z0-9]/g, "").substr(0, 10);
  const extension = path.extname(filename);
  const fileName = `${emailString}-${Math.round(
    Math.random() * 1e9
  )}${extension}`;
  if (config.AVATARS_LOCATION === "s3") {
    try {
      const result = await s3_upload(req, tempPath, fileName);
      req.file.avatarURL = result;
      await fs.unlink(tempPath);
    } catch (error) {
      await fs.unlink(tempPath);
      throw HttpError(500, error.message);
    }
  } else {
    const finalPath = path.join(storeImage, fileName);
    try {
      await fs.rename(tempPath, finalPath);
      req.file.avatarURI = `${avatarDir}/${fileName}`;
    } catch (error) {
      await fs.unlink(tempPath);
      throw HttpError(500, error.message);
    }
  }

  const result = await authServices.updateAvatar(email, req.file);
  res.json({
    avatarURL: result.avatarURL,
  });
};
