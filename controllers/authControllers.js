import HttpError from "../helpers/HttpError.js";
import authServices from "../services/authServices.js";

export const register = async (req, res, next) => {
  const result = await authServices.register(req.body);
  res.status(201).json({
    user: {
      email: result.email,
      subscription: result.subscription,
    },
  });
  //   try {
  //     const { email, password, subscription } = req.body;
  //     const user = await authServices.register({ email, password, subscription });
  //     res.status(201).json({
  //       user: {
  //         email: user.email,
  //         subscription: user.subscription,
  //       },
  //     });
  //   } catch (error) {
  //     next(HttpError(400, error.message));
  //   }
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
