import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

function StudentDashboard() {

  const [student, setStudent] = useState(null);

  const [attendancePercentage, setAttendancePercentage] =
    useState(0);

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


    const attendance =
      JSON.parse(
        localStorage.getItem("attendance")
      ) || {};


    let presentCount = 0;
    let absentCount = 0;


    Object.values(attendance).forEach(
      (dateAttendance) => {

        let status =
          dateAttendance[loggedInUser.rollNo];


        // Support old attendance records
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


    const total =
      presentCount + absentCount;


    if (total > 0) {

      setAttendancePercentage(
        Math.round(
          (presentCount / total) * 100
        )
      );

    } else {

      setAttendancePercentage(0);

    }

  }, []);


  if (!student) {

    return (
      <h2>
        Student not logged in
      </h2>
    );

  }


  // Attendance Risk

  let riskStatus = "";
  let riskMessage = "";


  if (attendancePercentage >= 75) {

    riskStatus = "🟢 Safe";

    riskMessage =
      "Your attendance is good.";

  }

  else if (attendancePercentage >= 65) {

    riskStatus = "🟡 Warning";

    riskMessage =
      "Your attendance is getting low.";

  }

  else {

    riskStatus = "🔴 Critical";

    riskMessage =
      "Your attendance is below the required level.";

  }


  // Classes needed for 75%

  let classesNeeded = 0;


  const total =
    present + absent;


  if (
    attendancePercentage < 75 &&
    total > 0
  ) {

    while (
      (present + classesNeeded) /
        (total + classesNeeded) <
      0.75
    ) {

      classesNeeded++;

    }

  }


  return (

    <div className="student-layout">

      {/* STUDENT SIDEBAR */}

      <StudentSidebar />


      {/* STUDENT CONTENT */}

      <div className="student-content">

        <h1>
          Welcome, {student.name} 👋
        </h1>

        <p>
          Here is your attendance overview.
        </p>


        {/* PROFILE */}

        <div className="student-info-card">

          <h2>
            Student Profile
          </h2>

          <p>
            <b>Name:</b>{" "}
            {student.name}
          </p>

          <p>
            <b>Roll Number:</b>{" "}
            {student.rollNo}
          </p>

        </div>


        {/* ATTENDANCE CARDS */}

        <div className="student-attendance-cards">


          <div className="student-card">

            <span>📚</span>

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


          <div className="student-card">

            <span>📊</span>

            <p>
              Attendance
            </p>

            <h2>
              {attendancePercentage}%
            </h2>

          </div>

        </div>


        {/* ATTENDANCE STATUS */}

        <div className="attendance-risk">

          <h2>
            Attendance Status
          </h2>

          <div className="risk-status">
            {riskStatus}
          </div>

          <p>
            {riskMessage}
          </p>

        </div>


        {/* LOW ATTENDANCE ALERT */}

        {attendancePercentage < 75 &&
          total > 0 && (

            <div className="low-attendance-alert">

              <div className="alert-icon">
                ⚠️
              </div>


              <div>

                <h2>
                  Low Attendance Alert
                </h2>

                <p>

                  Your attendance is{" "}
                  <strong>
                    {attendancePercentage}%
                  </strong>
                  . You are below the
                  required 75%.

                </p>


                <p>

                  🎯 Attend the next{" "}
                  <strong>
                    {classesNeeded}
                  </strong>{" "}
                  classes continuously
                  to reach 75%.

                </p>

              </div>

            </div>

          )}


        {/* GOOD ATTENDANCE MESSAGE */}

        {attendancePercentage >= 75 &&
          total > 0 && (

            <div className="good-attendance-alert">

              <div className="alert-icon">
                🎉
              </div>


              <div>

                <h2>
                  Great Attendance!
                </h2>

                <p>

                  Your attendance is{" "}
                  <strong>
                    {attendancePercentage}%
                  </strong>
                  . Keep maintaining
                  your attendance.

                </p>

              </div>

            </div>

          )}

      </div>

    </div>

  );

}

export default StudentDashboard;