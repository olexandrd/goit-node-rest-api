import path from "path";
import fs from "fs/promises";
import authServices from "../services/authServices.js";
import HttpError from "../helpers/HttpError.js";

const uploadDir = path.join(process.cwd(), "temp");
const avatarDir = "avatars";
const storeImage = path.join(process.cwd(), "public", avatarDir);

export const register = async (req, res, next) => {
  const user = await authServices.register(req.body);
  const { verificationToken } = user;
  await authServices.sendVerificationEmail(user.email, verificationToken);
  res.status(201).json({
    user: {
      email: user.email,
      subscription: user.subscription,
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
  const finalPath = path.join(storeImage, fileName);
  try {
    await fs.rename(tempPath, finalPath);
  } catch (error) {
    await fs.unlink(tempPath);
    return next(error);
  }
  req.file.avatarURI = `${avatarDir}/${fileName}`;

  const result = await authServices.updateAvatar(email, req.file);
  res.json({
    avatarURL: result.avatarURL,
  });
};

export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  await authServices.verifyEmail(verificationToken);
  res.status(200).send({ message: "Verification successful" });
};

export const repeatEmailVerification = async (req, res) => {
  const { email } = req.body;
  const user = await authServices.findUser({ email });
  if (!user) {
    throw HttpError(404, "User not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  await authServices.sendVerificationEmail(user.email, user.verificationToken);
  res.status(200).send({ message: "Verification email sent" });
};
