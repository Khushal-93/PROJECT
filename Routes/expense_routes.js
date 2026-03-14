const express = require("express");
const router = express.Router();

const Expense = require("../Models/expense");
const protect = require("../middleware/auth");


// Add new expense
router.post("/", protect, async (req, res) => {
  try {
    const expense = await Expense.create(req.body);
    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get all expenses
router.get("/", protect, async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;