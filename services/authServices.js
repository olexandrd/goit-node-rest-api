import bcrypt from "bcrypt";
import gravatar from "gravatar";
import { User } from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../middleware/jwt.js";
import config from "../config/config.js";

const register = async ({ email, password, subscription }) => {
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    throw HttpError(409, "Email in use");
  }
  const avatarURL = gravatar.url(email, { protocol: "https", s: "250" });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    subscription,
    avatarURL,
  });
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Email or password is wrong");
  }
  const payload = {
    id: user.id,
    email: user.email,
  };

  const token = await generateToken(payload);

  user.token = token;
  await user.save();
  return {
    token: token,
    user: { email: user.email, subscription: user.subscription },
  };
};

const findUser = async (email) => {
  return await User.findOne({ where: { email } });
};

const logout = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  user.token = null;
  await user.save();
};

const subscription = async (email, { subscription }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  user.subscription = subscription;
  await user.save();
  return user;
};

const updateAvatar = async (email, { avatarURI: avatarURI }) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw HttpError(401, "Not authorized");
  }
  user.avatarURL = `http://${config.DOMAIN}:${config.PORT}/${avatarURI}`;
  await user.save();
  return user;
};

export default {
  register,
  login,
  findUser,
  logout,
  subscription,
  updateAvatar,
};
