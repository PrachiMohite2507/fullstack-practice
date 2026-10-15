import { useState, useEffect } from "react";

function Attendance() {
  const STUDENTS_API = "http://localhost:5000/api/students";
  const ATTENDANCE_API = "http://localhost:5000/api/attendance";

  const [students, setStudents] = useState([]);
  const [date, setDate] = useState("");
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch students from MongoDB
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(STUDENTS_API);

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Unable to load students. Check backend server.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  // Fetch attendance for selected date from MongoDB
  async function changeDate(selectedDate) {
    setDate(selectedDate);
    setAttendance({});

    if (!selectedDate) return;

    try {
      const response = await fetch(
        `${ATTENDANCE_API}?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const records = await response.json();

      const attendanceData = {};

      records.forEach((record) => {
        if (record.student && record.student._id) {
          attendanceData[record.student._id] = record.status;
        }
      });

      setAttendance(attendanceData);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      alert("Unable to load attendance. Check backend server.");
    }
  }

  // Mark student Present or Absent
  function markAttendance(studentId, status) {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status
    }));
  }

  // Save attendance to MongoDB
  async function saveAttendance() {
    if (!date) {
      alert("Please select a date");
      return;
    }

    const records = Object.entries(attendance).map(
      ([studentId, status]) => ({
        studentId,
        status
      })
    );

    if (records.length === 0) {
      alert("Please mark attendance for at least one student");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(ATTENDANCE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          date,
          records
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save attendance");
      }

      alert("Attendance saved successfully in MongoDB!");
    } catch (error) {
      console.error("Error saving attendance:", error);
      alert(error.message || "Unable to save attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1>Attendance</h1>

      {/* Select Date */}
      <input
        type="date"
        value={date}
        onChange={(e) => changeDate(e.target.value)}
      />

      <p>Selected Date: {date || "No date selected"}</p>

      {/* Attendance Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Attendance</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>

                <td>
                  <button
                    type="button"
                    onClick={() =>
                      markAttendance(student._id, "Present")
                    }
                  >
                    Present
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      markAttendance(student._id, "Absent")
                    }
                  >
                    Absent
                  </button>
                </td>

                <td>
                  {attendance[student._id] || "Not Marked"}
                </td>
              </tr>
            ))}

            {students.length === 0 && (
              <tr>
                <td colSpan="4">
                  No students found. Add students first.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <br />

      <button
        type="button"
        onClick={saveAttendance}
        disabled={saving || loading}
      >
        {saving ? "Saving..." : "Save Attendance"}
      </button>
    </div>
  );
}

export default Attendance;