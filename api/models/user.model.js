const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    email: { type: String, required: true },
    password:{ type: String, required: true },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free"
    },
    token: { type: String, required: false}
  }
);

async function findUserById(id) {
  return await this.findOne({ id });
}
async function findByEmail(email) {
  return await this.findOne({email})  
}
async function updateToken( id, newtoken ) {
  return await this.findByIdAndUpdate(id, { token: newtoken })
}
userSchema.statics.findUserById = findUserById;
userSchema.statics.updateToken = updateToken;
userSchema.statics.findByEmail = findByEmail;

const usersModel = mongoose.model("users", userSchema);

module.exports = usersModel;