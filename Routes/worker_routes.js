const express = require("express");
const router = express.Router();
const Worker = require("../Models/worker");
const upload = require("../middleware/upload");

// CREATE worker with image
router.post("/", upload.single("photo"), async (req, res) => {
  try {
    const { name, mobile, salary, location } = req.body;

    const worker = new Worker({
      name,
      mobile,
      salary,
      location,
      photo: req.file ? req.file.filename : null,
    });

    const savedWorker = await worker.save();

    res.status(201).json(savedWorker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET workers
router.get("/", async (req, res) => {
  try {
    const workers = await Worker.find().populate("location");
    res.json(workers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;