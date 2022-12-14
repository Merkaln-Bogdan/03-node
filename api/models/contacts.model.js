const mongoose = require("mongoose");
const { Schema } = mongoose;
const contactSchema = new Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
});
async function findContactByIdAndUpdate(contactId, updateParams) {
  return this.findByIdAndUpdate(
    contactId,
    { $set: updateParams },
    { new: true }
  );
}

async function findAll() {
  return this.find();
}

contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
contactSchema.statics.findAll = findAll;

const contactsModel = mongoose.model("contact", contactSchema);

module.exports = contactsModel;
