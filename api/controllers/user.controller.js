const bcriptjs = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const usersModel = require("../models/user.model");
const { UnauthorizedError } = require("../helpers/errors.constructor");
const { minifyImage } = require("../imageController/imagemin");

module.exports = class UserControllers {
  // Create user controller with solt password bcrypt

  static async createUser(req, res, next) {
    try {
      const _constFactor = 4;
      const { password, email } = req.body;

      const passwordHash = await bcriptjs.hash(password, _constFactor);
      const existingUser = await usersModel.findByEmail(email);
      if (existingUser) {
        return res
          .status(409)
          .send("Пользователь с таким email уже существует!");
      }

      const user = await usersModel.create({
        email,
        password: passwordHash,
      });

      return res.status(201).json({
        id: user._id,
        email: user.email,
        status: user.status,
        token: user.token,
      });
    } catch (err) {
      next(err);
    }
  }

  // Get current user with selective information

  static async getCurrentUser(req, res, next) {
    const { _id, email, avatarURL, name, subscription } = req.user;
    res.status(200).json({
      id: _id,
      email,
      avatarURL,
      name,
      subscription,
    });
  }

  // Sign in user by email and password

  static async signIn(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await usersModel.findByEmail(email);
      if (!user) {
        return res.status(401).send("Authorization failed! Wrong email!");
      }
      const isPasswordValid = await bcriptjs.compare(password, user.password);
      if (!isPasswordValid) {
        return res
          .status(401)
          .send("Authorization failed! Pasword is not valid!");
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: 2 * 24 * 60 * 60,
      });
      await usersModel.updateToken(user._id, token);
      return res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  }
  //Logout user controller

  static async logOut(req, res, next) {
    try {
      const user = req.user;
      await usersModel.updateToken(user._id, null);
      return res.status(204).send("exit successfully");
    } catch (err) {
      next(err);
    }
  }

  // createUserAvatar with multer and minifyImage

  static async createUserAvatar(req, res, next) {
    const { _id } = req.user;

    try {
      await minifyImage(req, res, next);
      await usersModel.findOneAndUpdate(
        { _id },
        {
          avatarURL: `http://localhost:4040/${req.file.filename}`,
        }
      );
      return res.status(200).json({ message: "Image uploaded" });
    } catch (err) {
      next(err);
    }
  }

  //Autorization user controller

  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization");
      const token = authorizationHeader.replace("Bearer ", "");

      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        next(new UnauthorizedError("User not authorized"));
      }

      const user = await usersModel.findById(userId);
      if (!user || user.token !== token) {
        throw new UnauthorizedError("User not authorized!!!");
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      throw new UnauthorizedError("Not authorized!");
    }
  }

  //Validation create user controller

  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const result = createUserRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    next();
  }

  // Validate signin controller

  static validateSignIn(req, res, next) {
    const signInRules = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validateRezult = signInRules.validate(req.body);
    if (validateRezult.error) {
      return res.status(400).send(validateRezult.error);
    }
    next();
  }

  // verify user email by token
  static async verifyEmail(req, res, next) {
    try {
      const { email } = req.body;
      const { verificationToken } = req.params;

      if (!verificationToken) {
        throw new NotFoundUserError("user not found!");
      }
      await usersModel.findOneAndUpdate(email, {
        status: "Verified",
        verificationToken: null,
      });
      return res.status(200).send("You`re email successfully verified! ");
    } catch (err) {
      next(err);
    }
  }
};
