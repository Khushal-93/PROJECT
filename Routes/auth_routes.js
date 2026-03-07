const express = require("express");
const router = express.Router();

const Admin = require("../Models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Admin register (temporary)
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const bcrypt = require("bcryptjs");

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      email,
      password: hashedPassword,
    });

    res.status(201).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { adminId: admin._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;