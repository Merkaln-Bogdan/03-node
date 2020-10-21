
const Joi = require('joi');
const contactsModel = require('../mongodbServices/contactSchema');
const {
  Types: { ObjectId },
} = require("mongoose");

module.exports = class Controllers {

 
  static async createContact(req, res, next) {
    try {
      const contact = await contactsModel.create(req.body);
      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }



  }
  static validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string()

    })
    const result = createContactRules.validate(req.body)
    if (result.error) {
      return res.status(400).send(result.error)
    }
    next()
  }
  static async getContact(req, res, next) {
    const { contactId } = req.params;

    try {
      const contact = await contactsModel.findById(contactId);
      if (!contact) {
        return res.status(404).json("not found");
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async deleteContact(req, res, next) {
    const { contactId } = req.params;
    try {
      const deleteContact = await contactsModel.findByIdAndDelete( contactId );
      if (!deleteContact) {
        return res.status(404).json();
      }
      return res.status(200).json("contact deleted");
    } catch (err) {
      next(err);
    }
  }
  static async updateContacts(req, res, next) {
    try {
      const contact = await contactsModel.findByIdAndUpdate(
        req.params.contactId,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!contact) {
        return res.status(404).json();
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }
  static validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string()         
    })
    const result = updateContactRules.validate(req.body)
    if (result.error) {
      return res.status(400).send(result.error)
    }
    next()
  }
  static validateId(req, res, next) {
    const { contactId } = req.params;
    if (!ObjectId.isValid(contactId)) {
      req.status(400).send()
    }
    next()
  }
}