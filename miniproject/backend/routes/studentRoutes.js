
const express = require("express");
const router = express.Router();

const Student = require("../models/Student");
const Attendance = require("../models/Attendance");

// GET: All students
router.get("/", async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch students" });
    }
});

// POST: Add a student
router.post("/", async (req, res) => {
    try {
        const { name, rollNo, password } = req.body;

        if (!name || rollNo === undefined || rollNo === null ||
            String(rollNo).trim() === "" || !password) {
            return res.status(400).json({
                message: "Name, roll number and password are required"
            });
        }

        const student = await Student.create({
            name,
            rollNo,
            password
        });

        res.status(201).json({
            message: "Student added successfully",
            student: {
                _id: student._id,
                name: student.name,
                rollNo: student.rollNo
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Roll number already exists"
            });
        }

        res.status(400).json({
            message: "Failed to add student"
        });
    }
});

// PUT: Update a student
router.put("/:id", async (req, res) => {
    try {
        const { name, rollNo, password } = req.body;
        const updateData = { name, rollNo };

        if (password) {
            updateData.password = password;
        }

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student updated successfully",
            student: {
                _id: student._id,
                name: student.name,
                rollNo: student.rollNo
            }
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Roll number already exists"
            });
        }

        res.status(400).json({
            message: "Failed to update student"
        });
    }
});

// DELETE: Delete a student and their attendance
router.delete("/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        await Attendance.deleteMany({ student: student._id });

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        res.status(400).json({
            message: "Failed to delete student"
        });
    }
});

module.exports = router;
