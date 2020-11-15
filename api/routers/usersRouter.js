const { Router } = require('express');
const UserControllers = require('../controllers/user.controller');
const usersRouter = Router();
const userController = require('../controllers/user.controller')
const {upload} = require('../imageController/imagemin')

usersRouter.post("/auth/register", userController.validateCreateUser, userController._createUser);
usersRouter.get("/users/current",userController.authorize, userController.getCurrentUser)
usersRouter.post("/auth/signin", userController.validateSignIn, userController.signIn);
usersRouter.patch("/auth/logout", userController.authorize, userController.logOut);
usersRouter.patch("/avatars", userController.authorize, upload.single("avatars"), userController.createUserAvatar);
module.exports = usersRouter