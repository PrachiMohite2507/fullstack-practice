
const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },

    date: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: ["Present", "Absent"],
        required: true
    }
});

// Same student ki same date par duplicate attendance nahi hogi
attendanceSchema.index(
    { student: 1, date: 1 },
    { unique: true }
);

const Attendance = mongoose.model(
    "Attendance",
    attendanceSchema
);

module.exports = Attendance;
