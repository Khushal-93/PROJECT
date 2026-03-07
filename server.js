const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const workerRoutes = require("./Routes/worker_routes");
const attendanceRoutes = require("./Routes/attendance_routes");
const salaryRoutes = require("./Routes/salary_routes");
const authRoutes = require("./Routes/auth_routes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use("/api/workers", workerRoutes);
app.use("/api/salary", salaryRoutes);
app.use("/api/auth", authRoutes);


// Routes
const locationRoutes = require("./Routes/location_routes");
app.use("/api/locations", locationRoutes);
app.use("/api/attendance", attendanceRoutes);



// Test route
app.get("/", (req, res) => {
  res.send("Furniture Management Backend Running 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});