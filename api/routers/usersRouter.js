const { Router } = require('express');
const usersRouter = Router();
const userController = require('../controllers/user.controller')

usersRouter.post("/auth/register", userController.validateCreateUser, userController._createUser);
usersRouter.get("/users/current",userController.authorize, userController.getCurrentUser)
usersRouter.post("/auth/signin", userController.validateSignIn, userController.signIn);
usersRouter.patch("/auth/logout", userController.authorize, userController.logOut);

module.exports = usersRouter