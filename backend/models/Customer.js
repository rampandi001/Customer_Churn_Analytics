const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    age: {
      type: Number,
    },

    gender: {
      type: String,
    },

    location: {
      type: String,
    },

    subscription: {
      type: String,
    },

    monthlySpend: {
      type: Number,
    },

    tenure: {
      type: Number,
    },

    churnRisk: {
      type: Number,
      default: 0,
    },

    churnStatus: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Low",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Customer", customerSchema);