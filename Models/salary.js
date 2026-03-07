const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    totalDaysInMonth: {
      type: Number,
      required: true,
    },
    presentDays: {
      type: Number,
      required: true,
    },
    monthlySalary: {
      type: Number,
      required: true,
    },
    payableSalary: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    paymentMode: {
      type: String,
      enum: ["Cash", "UPI", "Bank", "Cheque"],
    },
    paidDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Prevent duplicate salary per month per worker
salarySchema.index({ worker: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Salary", salarySchema);