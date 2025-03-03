import multer from "multer";
import path from "path";
import fs from "fs/promises";

import HttpError from "../helpers/HttpError.js";
const uploadDir = path.join(process.cwd(), "temp");
const avatarDir = "avatars";
const storeImage = path.join(process.cwd(), "public", avatarDir);

const isAccessible = async (path) => {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
};

const createFolderIsNotExist = async (folder) => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

createFolderIsNotExist(uploadDir);
createFolderIsNotExist(storeImage);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 2000000,
  },
});

export const upload = multer({
  storage: storage,
});

export const uploadMiddleware = async (req, res, next) => {
  const { originalname, mimetype } = req.file;
  if (!mimetype.includes("image")) {
    await fs.unlink(req.file.path);
    return next(HttpError(400, "Wrong file format"));
  }
  const tempPath = path.join(uploadDir, originalname);
  const emailString = req.user.email.replace(/[^a-zA-Z0-9]/g, "").substr(0, 10);
  const extension = path.extname(originalname);
  const fileName = `${emailString}-${Math.round(
    Math.random() * 1e9
  )}${extension}`;
  const finalPath = path.join(storeImage, fileName);
  try {
    await fs.rename(tempPath, finalPath);
  } catch (error) {
    await fs.unlink(tempPath);
    return next(error);
  }
  req.file.avatarURI = `${avatarDir}/${fileName}`;
  next();
};
