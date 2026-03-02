const express = require("express");
const router = express.Router();
const Attendance = require("../Models/attendance");

// CREATE attendance
router.post("/", async (req, res) => {
  try {
    const { worker, location, date, status, note } = req.body;

    const attendance = new Attendance({
      worker,
      location,
      date,
      status,
      note,
    });

    const savedAttendance = await attendance.save();

    res.status(201).json(savedAttendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET attendance by worker
router.get("/worker/:id", async (req, res) => {
  try {
    const records = await Attendance.find({ worker: req.params.id })
      .populate("worker")
      .populate("location");

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;