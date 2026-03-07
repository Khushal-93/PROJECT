const express = require("express");
const router = express.Router();

const Salary = require("../Models/salary");
const Worker = require("../Models/worker");
const Attendance = require("../Models/attendance");

// Generate salary
router.post("/generate", async (req, res) => {
  try {
    const { workerId, month, year } = req.body;

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

    const salary = await Salary.create({
      worker: workerId,
      month,
      year,
      totalDaysInMonth,
      presentDays,
      monthlySalary: worker.salary,
      payableSalary,
    });

    res.status(201).json(salary);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Salary already generated for this month" });
    }

    res.status(500).json({ message: error.message });
  }
});

// Get salary history
router.get("/worker/:id", async (req, res) => {
  try {
    const salaries = await Salary.find({ worker: req.params.id }).populate(
      "worker"
    );
    res.json(salaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 💸 Mark salary as Paid
router.patch("/pay/:salaryId", async (req, res) => {
  try {
    const { salaryId } = req.params;
    const { paymentMode } = req.body;

    const salary = await Salary.findById(salaryId);

    if (!salary) {
      return res.status(404).json({ message: "Salary record not found" });
    }

    if (salary.status === "Paid") {
      return res.status(400).json({ message: "Salary already paid" });
    }

    salary.status = "Paid";
    salary.paymentMode = paymentMode;
    salary.paidDate = new Date();

    await salary.save();

    res.json({ message: "Salary marked as Paid", salary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;