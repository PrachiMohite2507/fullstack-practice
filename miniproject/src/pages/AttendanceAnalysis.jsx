import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

function AttendanceAnalysis() {

  const [student, setStudent] = useState(null);
  const [present, setPresent] = useState(0);
  const [absent, setAbsent] = useState(0);

  useEffect(() => {

    const savedUser =
      localStorage.getItem("loggedInUser");

    if (!savedUser) {
      return;
    }

    const loggedInUser =
      JSON.parse(savedUser);

    setStudent(loggedInUser);


    const savedAttendance =
      JSON.parse(
        localStorage.getItem("attendance")
      ) || {};


    let presentCount = 0;
    let absentCount = 0;


    Object.values(savedAttendance).forEach(
      (dateAttendance) => {

        let status =
          dateAttendance[loggedInUser.rollNo];

        // Support old ID-based records
        if (!status) {
          status =
            dateAttendance[loggedInUser.id];
        }

        if (status === "Present") {
          presentCount++;
        }

        if (status === "Absent") {
          absentCount++;
        }

      }
    );


    setPresent(presentCount);
    setAbsent(absentCount);

  }, []);


  if (!student) {

    return (
      <div className="student-content">
        <h2>Student not logged in</h2>
      </div>
    );

  }


  const total =
    present + absent;


  const percentage =
    total > 0
      ? Math.round((present / total) * 100)
      : 0;


  // Calculate classes needed to reach 75%

  let classesNeeded = 0;

  if (percentage < 75 && total > 0) {

    let additionalClasses = 0;

    while (
      (present + additionalClasses) /
        (total + additionalClasses) <
      0.75
    ) {

      additionalClasses++;

    }

    classesNeeded = additionalClasses;

  }


  // Attendance status

  let status = "";
  let message = "";


  if (percentage >= 75) {

    status = "🟢 Good Attendance";

    message =
      "Your attendance is above the required level.";

  } else if (percentage >= 65) {

    status = "🟡 Warning";

    message =
      "Your attendance is getting low. Try to attend more classes.";

  } else {

    status = "🔴 Critical";

    message =
      "Your attendance is below the required level.";

  }


  return (

    <div className="student-layout">

      {/* STUDENT SIDEBAR */}

      <StudentSidebar />


      {/* CONTENT */}

      <div className="student-content">

        <h1>
          Attendance Analysis 📈
        </h1>

        <p>
          Analyze your attendance performance.
        </p>


        {/* MAIN PERCENTAGE CARD */}

        <div className="analysis-main-card">

          <h2>
            Overall Attendance
          </h2>


          <div className="attendance-circle">

            <span>
              {percentage}%
            </span>

          </div>


          <h3>
            {status}
          </h3>

          <p>
            {message}
          </p>

        </div>


        {/* STAT CARDS */}

        <div className="student-attendance-cards">

          <div className="student-card">

            <span>📚</span>

            <p>
              Total Classes
            </p>

            <h2>
              {total}
            </h2>

          </div>


          <div className="student-card">

            <span>✅</span>

            <p>
              Present
            </p>

            <h2>
              {present}
            </h2>

          </div>


          <div className="student-card">

            <span>❌</span>

            <p>
              Absent
            </p>

            <h2>
              {absent}
            </h2>

          </div>

        </div>


        {/* CLASSES NEEDED */}

        <div className="attendance-goal-card">

          <h2>
            🎯 Attendance Goal
          </h2>


          {percentage >= 75 ? (

            <p>
              🎉 Your attendance is already
              above 75%!
            </p>

          ) : total === 0 ? (

            <p>
              No attendance data available yet.
            </p>

          ) : (

            <p>
              You need to attend your next{" "}
              <strong>
                {classesNeeded} classes
              </strong>{" "}
              continuously to reach 75%
              attendance.
            </p>

          )}

        </div>

      </div>

    </div>

  );

}

export default AttendanceAnalysis;