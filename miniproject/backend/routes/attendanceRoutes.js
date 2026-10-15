const express = require("express");
const router = express.Router();

const Attendance = require("../models/Attendance");
const Student = require("../models/Student");

// GET: Fetch attendance for a selected date
router.get("/", async (req, res) => {
    try {
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({
                message: "Please provide a date"
            });
        }

        const records = await Attendance.find({ date })
            .populate("student", "name rollNo");

        res.status(200).json(records);

    } catch (error) {
        console.error("Fetch attendance error:", error);

        res.status(500).json({
            message: "Failed to fetch attendance"
        });
    }
});

// POST: Save or update attendance for a date
router.post("/", async (req, res) => {
    try {
        const { date, records } = req.body;

        if (!date || !Array.isArray(records)) {
            return res.status(400).json({
                message: "Date and attendance records are required"
            });
        }

        const results = await Promise.all(
            records.map(async (record) => {
                const { studentId, status } = record;

                if (
                    !studentId ||
                    !["Present", "Absent"].includes(status)
                ) {
                    throw new Error("Invalid student ID or attendance status");
                }

                const student = await Student.findById(studentId);

                if (!student) {
                    throw new Error("Student not found: " + studentId);
                }

                return Attendance.findOneAndUpdate(
                    {
                        student: studentId,
                        date: date
                    },
                    {
                        student: studentId,
                        date: date,
                        status: status
                    },
                    {
                        new: true,
                        upsert: true,
                        runValidators: true
                    }
                );
            })
        );

        res.status(200).json({
            message: "Attendance saved successfully",
            attendance: results
        });

    } catch (error) {
        console.error("Save attendance error:", error);

        res.status(400).json({
            message: error.message || "Failed to save attendance"
        });
    }
});

module.exports = router;