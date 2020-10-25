  
const mongoose = require("mongoose");
const { Schema } = mongoose;
const contactSchema = new Schema(
  {
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
  }
);
async function findContactByIdAndUpdate(contactId, updaeParams){
  return this.findByIdAndUpdate(
    contactId,
    {$set: updaeParams,},
    {new: true,}
    )
  }
async function findByEmail(email) {
  return this.findOne({email})  
}

contactSchema.statics.findByEmail = findByEmail;
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;
const contactsModel = mongoose.model("contact", contactSchema);

module.exports = contactsModel;