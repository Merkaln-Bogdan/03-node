
const { Router } = require('express');
const userRouter = Router();
const Controllers = require("../controllers/contactController");

userRouter.post("/", Controllers.validateCreateContact, Controllers.createContact);
userRouter.get("/:contactId", Controllers.validateId, Controllers.getContact);
userRouter.delete("/:contactId", Controllers.validateId, Controllers.deleteContact);
userRouter.patch("/:contactId", Controllers.validateUpdateContact, Controllers.validateId, Controllers.updateContacts)

module.exports = userRouter