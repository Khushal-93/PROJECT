const express = require("express");
const router = express.Router();

const Expense = require("../Models/expense");
const Worker = require("../Models/worker");
const Salary = require("../Models/salary");
const Attendance = require("../Models/attendance");
const protect = require("../middleware/auth");

// Dashboard summary
router.get("/summary", protect, async (req, res) => {
  try {
    const totalWorkers = await Worker.countDocuments();

    const activeWorkers = await Worker.countDocuments({
      status: { $ne: "Left" }
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const presentToday = await Attendance.countDocuments({
      status: "Present",
      date: { $gte: today }
    });

    const absentToday = await Attendance.countDocuments({
      status: "Absent",
      date: { $gte: today }
    });

    const salaries = await Salary.find();
    const expenses = await Expense.find();

    let totalSalary = 0;
    let paidSalary = 0;
    let pendingSalary = 0;
    let totalExpenses = 0;

    salaries.forEach((salary) => {
      totalSalary += salary.payableSalary;

      if (salary.status === "Paid") {
        paidSalary += salary.payableSalary;
      } else {
        pendingSalary += salary.payableSalary;
      }
    });

    expenses.forEach((expense) => {
      totalExpenses += expense.amount;
    });

    res.json({
      totalWorkers,
      activeWorkers,
      presentToday,
      absentToday,
      totalSalary,
      paidSalary,
      pendingSalary,
      totalExpenses,
      profitEstimate: -(totalSalary + totalExpenses)
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;