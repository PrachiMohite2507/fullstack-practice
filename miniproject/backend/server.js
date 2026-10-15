
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const studentRoutes = require("./routes/studentRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);
const attendanceRoutes = require("./routes/attendanceRoutes");

app.use("/api/attendance", attendanceRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.get("/", (req, res) => {
            res.send("Student Attendance Backend is running!");
        });

        const PORT = 5000;

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB connection failed:", error.message);
    });

