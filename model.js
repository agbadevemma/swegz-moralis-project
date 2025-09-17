// models.js
const mongoose = require("mongoose");

// Wallet Schema
const walletSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  privateKey: { type: String },
  mnemonic: { type: String },
  createdAt: { type: Date, default: Date.now },
});

// Transaction Schema
const txSchema = new mongoose.Schema({
  hash: { type: String, required: true, unique: true },
  from: String,
  to: String,
  value: String,
  confirmed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Wallet = mongoose.model("Wallet", walletSchema);
const Transaction = mongoose.model("Transaction", txSchema);

module.exports = { Wallet, Transaction };
