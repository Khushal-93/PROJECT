const express = require("express");
const router = express.Router();
const Attendance = require("../Models/attendance");
const protect = require("../middleware/auth");

// CREATE attendance
router.post("/", protect, async (req, res) => {
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
router.get("/worker/:id", protect, async (req, res) => {
  try {
    const records = await Attendance.find({ worker: req.params.id })
      .populate("worker")
      .populate("location");

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly salary summary for worker
router.get("/salary/:workerId/:year/:month", protect, async (req, res) => {
  try {
    const { workerId, year, month } = req.params;

    const Worker = require("../Models/worker");

    const worker = await Worker.findById(workerId);

    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const presentDays = await Attendance.countDocuments({
      worker: workerId,
      status: "Present",
      date: { $gte: startDate, $lte: endDate },
    });

    const totalDaysInMonth = endDate.getDate();
    const dailySalary = worker.salary / totalDaysInMonth;
    const payableSalary = presentDays * dailySalary;

    res.json({
      worker: worker.name,
      month,
      year,
      totalDaysInMonth,
      presentDays,
      absentDays: totalDaysInMonth - presentDays,
      monthlySalary: worker.salary,
      dailySalary: dailySalary.toFixed(2),
      payableSalary: payableSalary.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
 
module.exports = router;