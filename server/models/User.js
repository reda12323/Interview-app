const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    // Firebase Auth Fields
    uid: { type: String, required: false, unique: true },
    email: { type: String, required: true },
    displayName: { type: String },
    photoURL: { type: String },
    provider: { type: String },

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);
