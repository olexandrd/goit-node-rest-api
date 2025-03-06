import multer from "multer";
import path from "path";
import fs from "fs/promises";

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
    cb(null, `${Math.round(Math.random() * 1e9)}-${file.originalname}`);
  },
});

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2000000,
  },
});
