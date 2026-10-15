import { useEffect, useState } from "react";

function Dashboard() {
  const [totalStudents, setTotalStudents] = useState(0);
  const [presentToday, setPresentToday] = useState(0);
  const [absentToday, setAbsentToday] = useState(0);
  const [attendancePercentage, setAttendancePercentage] = useState(0);

  useEffect(() => {
    loadDashboardData();
  }, []);

  function loadDashboardData() {
    // Get students
    const students =
      JSON.parse(localStorage.getItem("students")) || [];

    // Get attendance
    const attendance =
      JSON.parse(localStorage.getItem("attendance")) || {};

    // Total students
    setTotalStudents(students.length);

    // Today's date
    const today = new Date().toISOString().split("T")[0];

    // Today's attendance
    const todayAttendance = attendance[today] || {};

    let present = 0;
    let absent = 0;

    Object.values(todayAttendance).forEach((status) => {
      if (status === "Present") {
        present++;
      }

      if (status === "Absent") {
        absent++;
      }
    });

    setPresentToday(present);
    setAbsentToday(absent);

    // Calculate percentage
    const totalMarked = present + absent;

    if (totalMarked > 0) {
      const percentage = Math.round(
        (present / totalMarked) * 100
      );

      setAttendancePercentage(percentage);
    } else {
      setAttendancePercentage(0);
    }
  }

  return (
    <div className="dashboard">

      {/* Hero Section */}

      <div className="dashboard-hero">

        <div className="hero-content">

          <p>STUDENT ATTENDANCE SYSTEM</p>

          <h1>
            Manage Attendance
            <br />
            Easily & Efficiently
          </h1>

          <span>
            Track student attendance, manage records
            and achieve better results.
          </span>

        </div>

      </div>


      {/* Dashboard Cards */}

      <div className="dashboard-cards">

        {/* Total Students */}

        <div className="dashboard-card">

          <div className="card-icon">
            👨‍🎓
          </div>

          <div>
            <p>Total Students</p>
            <h2>{totalStudents}</h2>
          </div>

        </div>


        {/* Present */}

        <div className="dashboard-card">

          <div className="card-icon">
            ✅
          </div>

          <div>
            <p>Present Today</p>
            <h2>{presentToday}</h2>
          </div>

        </div>


        {/* Absent */}

        <div className="dashboard-card">

          <div className="card-icon">
            ❌
          </div>

          <div>
            <p>Absent Today</p>
            <h2>{absentToday}</h2>
          </div>

        </div>


        {/* Attendance Percentage */}

        <div className="dashboard-card">

          <div className="card-icon">
            📊
          </div>

          <div>
            <p>Attendance</p>
            <h2>{attendancePercentage}%</h2>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;