const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    worker: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      required: true,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Location",
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Present", "Absent"],
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

attendanceSchema.index({ worker: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);