const bcriptjs = require("bcrypt");
const Joi = require("joi");
const contactsModel = require("../models/contacts.model");
const jwt = require("jsonwebtoken");
const {
  Types: { ObjectId },
} = require("mongoose");
// const { static } = require('express');

module.exports = class ContactsControllers {
  constructor() {
    this._consFactor = 4;
  }

  static async getListContacts(req, res, next) {
    try {
      const contacts = await contactsModel.findAll();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  // Create contact controller

  static async createContact(req, res, next) {
    try {
      const contact = await contactsModel.create(req.body);
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  //Validation create contact controller

  static validateCreateContact(req, res, next) {
    const createContactRules = Joi.object({
      name: Joi.string().required(),
      number: Joi.string().required(),
    });
    const result = createContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    next();
  }

  //Get contact controller by id

  static async getContact(req, res, next) {
    const { contactId } = req.params;

    try {
      const contact = await contactsModel.findById({ contactId });
      if (!contact) {
        return res.status(404).json("not found");
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }
  // Delete contact by id controller

  static async deleteContact(req, res, next) {
    const { contactId } = req.params;

    try {
      const deleteContact = await contactsModel.findByIdAndDelete(contactId);

      if (!deleteContact) {
        return res.status(404).json();
      }
      return res.status(200).json();
    } catch (err) {
      next(err);
    }
  }

  // Update contact by id controller

  static async updateContacts(req, res, next) {
    try {
      const contact = await contactsModel.findByIdAndUpdate(
        req.params.id,
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

  // Validate update contact

  static validateUpdateContact(req, res, next) {
    const updateContactRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subcription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const result = updateContactRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error);
    }
    next();
  }

  // Validate id controller

  static validateId(req, res, next) {
    const { contactId } = req.params;
    if (!ObjectId.isValid(contactId)) {
      res.status(400).send();
    }
    next();
  }
};
