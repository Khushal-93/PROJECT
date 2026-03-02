const mongoose = require("mongoose");

const workerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    mobile: { type: String, required: true },
    salary: { type: Number, required: true },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    photo: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Worker", workerSchema);