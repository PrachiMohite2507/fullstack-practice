import { useState } from "react";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  async function generateReport() {
    setLoading(true);

    try {
      // Fetch latest students from MongoDB
      const studentsResponse = await fetch(
        "http://localhost:5000/api/students"
      );

      if (!studentsResponse.ok) {
        throw new Error("Unable to fetch students");
      }

      const students = await studentsResponse.json();

      // Fetch all saved attendance records date by date.
      // The API requires a date, so query each date on which
      // attendance could have been saved.
      const dates = [];
      const today = new Date();

      for (let i = 0; i < 366; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        dates.push(
          `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
        );
      }

      const attendanceResponses = await Promise.all(
        dates.map((date) =>
          fetch(
            `http://localhost:5000/api/attendance?date=${date}`
          )
        )
      );

      if (attendanceResponses.some((response) => !response.ok)) {
        throw new Error("Unable to fetch attendance records");
      }

      const attendanceArrays = await Promise.all(
        attendanceResponses.map((response) => response.json())
      );

      const allAttendance = attendanceArrays.flat();

      // Calculate each student's attendance
      const reportData = students.map((student) => {
        const studentRecords = allAttendance.filter(
          (record) =>
            record.student &&
            record.student._id === student._id
        );

        const present = studentRecords.filter(
          (record) => record.status === "Present"
        ).length;

        const absent = studentRecords.filter(
          (record) => record.status === "Absent"
        ).length;

        const total = present + absent;

        const percentage =
          total > 0 ? Math.round((present / total) * 100) : 0;

        return {
          id: student._id,
          rollNo: student.rollNo,
          name: student.name,
          present,
          absent,
          total,
          percentage
        };
      });

      setReports(reportData);
      setGenerated(true);
    } catch (error) {
      console.error("Report error:", error);
      alert(
        "Reports load nahi hue. Backend server check karo."
      );
    } finally {
      setLoading(false);
    }
  }

  const totalStudents = reports.length;

  const totalPresent = reports.reduce(
    (sum, student) => sum + student.present,
    0
  );

  const totalAbsent = reports.reduce(
    (sum, student) => sum + student.absent,
    0
  );

  const totalClasses = totalPresent + totalAbsent;

  const overallPercentage =
    totalClasses > 0
      ? Math.round((totalPresent / totalClasses) * 100)
      : 0;

  const goodStudents = reports.filter(
    (student) => student.total > 0 && student.percentage >= 75
  ).length;

  const warningStudents = reports.filter(
    (student) =>
      student.percentage >= 65 &&
      student.percentage < 75 &&
      student.total > 0
  ).length;

  const criticalStudents = reports.filter(
    (student) =>
      student.percentage < 65 && student.total > 0
  ).length;

  return (
    <div className="reports-page">
      <h1>Attendance Analytics 📊</h1>

      <p>Analyze overall student attendance performance.</p>

      <button
        className="generate-report-button"
        onClick={generateReport}
        disabled={loading}
      >
        {loading ? "Loading Reports..." : "📊 Generate Analytics"}
      </button>

      <div className="analytics-cards">
        <div className="analytics-card">
          <span>👨‍🎓</span>
          <p>Total Students</p>
          <h2>{totalStudents}</h2>
        </div>

        <div className="analytics-card">
          <span>✅</span>
          <p>Total Present</p>
          <h2>{totalPresent}</h2>
        </div>

        <div className="analytics-card">
          <span>❌</span>
          <p>Total Absent</p>
          <h2>{totalAbsent}</h2>
        </div>

        <div className="analytics-card">
          <span>📈</span>
          <p>Overall Attendance</p>
          <h2>{overallPercentage}%</h2>
        </div>
      </div>

      <div className="analytics-status-card">
        <h2>Student Attendance Status</h2>

        <div className="status-grid">
          <div className="status-box good">
            <span>🟢</span>
            <h3>{goodStudents}</h3>
            <p>Good Attendance</p>
            <small>75% and above</small>
          </div>

          <div className="status-box warning">
            <span>🟡</span>
            <h3>{warningStudents}</h3>
            <p>Warning</p>
            <small>65% – 74%</small>
          </div>

          <div className="status-box critical">
            <span>🔴</span>
            <h3>{criticalStudents}</h3>
            <p>Critical</p>
            <small>Below 65%</small>
          </div>
        </div>
      </div>

      <div className="analytics-table-card">
        <h2>Student Attendance Report</h2>

        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Total Classes</th>
              <th>Attendance %</th>
            </tr>
          </thead>

          <tbody>
            {reports.map((student) => (
              <tr key={student.id}>
                <td>{student.rollNo}</td>
                <td>{student.name}</td>
                <td>{student.present}</td>
                <td>{student.absent}</td>
                <td>{student.total}</td>
                <td>{student.percentage}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {reports.length === 0 && (
          <p className="no-report">
            {loading
              ? "Loading attendance data..."
              : generated
              ? "No students found."
              : 'Click "Generate Analytics" to load the latest data.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default Reports;