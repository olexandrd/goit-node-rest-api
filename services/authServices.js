import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import gravatar from "gravatar";
import { User } from "../models/User.js";
import HttpError from "../helpers/HttpError.js";
import { generateToken } from "../middleware/jwt.js";
import config from "../config/config.js";
import sendEmail from "../helpers/sendEmail.js";

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
    verificationToken: uuidv4(),
  });
  return user;
};

const login = async ({ email, password }) => {
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw HttpError(401, "Email or password is wrong");
  }
  if (!user.verify) {
    throw HttpError(403, "Email not verified");
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

const findUser = async (queue) => {
  return await User.findOne({ where: { ...queue } });
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

const verifyEmail = async (verificationToken) => {
  const user = await User.findOne({ where: { verificationToken } });
  if (!user) {
    throw HttpError(404, "User or token not found");
  }
  user.verificationToken = null;
  user.verify = true;
  await user.save();
  return user;
};

const sendVerificationEmail = async (email, verificationToken) => {
  const user = await User.findOne({ where: { email } });
  const emailData = {
    subject: "Email verification",
    to: email,
    html: `<h1>Hello from ${config.DOMAIN}!</h1>
    <p>Please verify your email: <a href="http://${config.DOMAIN}:${config.PORT}/api/auth/verify/${verificationToken}">Verify</a></p>`,
  };

  await sendEmail(emailData)
    .then(() => console.log(`Email sent to ${emailData.to}`))
    .catch((error) => {
      console.error(`Error during sending email, ${error}`);
      throw HttpError(500, `Error during sending email`);
    });
};

export default {
  register,
  login,
  findUser,
  logout,
  subscription,
  updateAvatar,
  verifyEmail,
  sendVerificationEmail,
};
