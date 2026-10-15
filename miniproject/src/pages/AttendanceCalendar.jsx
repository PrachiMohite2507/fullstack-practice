import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

function AttendanceCalendar() {

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState({});

  const [currentDate, setCurrentDate] =
    useState(new Date());


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

    setAttendance(savedAttendance);

  }, []);


  if (!student) {

    return (
      <div className="student-content">

        <h2>
          Student not logged in
        </h2>

      </div>
    );

  }


  // Current month and year

  const year =
    currentDate.getFullYear();

  const month =
    currentDate.getMonth();


  // Number of days in month

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();


  // First day of month

  const firstDay =
    new Date(
      year,
      month,
      1
    ).getDay();


  // Month name

  const monthName =
    currentDate.toLocaleString(
      "default",
      {
        month: "long"
      }
    );


  // Previous month

  function previousMonth() {

    setCurrentDate(
      new Date(
        year,
        month - 1,
        1
      )
    );

  }


  // Next month

  function nextMonth() {

    setCurrentDate(
      new Date(
        year,
        month + 1,
        1
      )
    );

  }


  // Get attendance status

  function getStatus(day) {

    const dateString =
      `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;


    const dateData =
      attendance[dateString];


    if (!dateData) {
      return "";
    }


    // New format - roll number

    if (
      dateData[student.rollNo] !== undefined
    ) {

      return dateData[student.rollNo];

    }


    // Old format - student ID

    if (
      dateData[student.id] !== undefined
    ) {

      return dateData[student.id];

    }


    return "";

  }


  // Create calendar days

  const calendarDays = [];


  // Empty spaces before first day

  for (
    let i = 0;
    i < firstDay;
    i++
  ) {

    calendarDays.push(null);

  }


  // Actual days

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {

    calendarDays.push(day);

  }


  return (

    <div className="student-layout">

      <StudentSidebar />


      <div className="student-content">

        <h1>
          Attendance Calendar 📅
        </h1>

        <p>
          Track your attendance month-wise.
        </p>


        <div className="calendar-card">


          {/* CALENDAR HEADER */}

          <div className="calendar-header">

            <button
              onClick={previousMonth}
            >
              ← Previous
            </button>


            <h2>
              {monthName} {year}
            </h2>


            <button
              onClick={nextMonth}
            >
              Next →
            </button>

          </div>


          {/* LEGEND */}

          <div className="calendar-legend">

            <span>
              🟢 Present
            </span>

            <span>
              🔴 Absent
            </span>

            <span>
              ⚪ Not Marked
            </span>

          </div>


          {/* DAYS */}

          <div className="calendar-weekdays">

            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>

          </div>


          {/* CALENDAR */}

          <div className="calendar-grid">

            {calendarDays.map(
              (day, index) => {

                if (day === null) {

                  return (
                    <div
                      key={index}
                      className="calendar-empty"
                    ></div>
                  );

                }


                const status =
                  getStatus(day);


                let statusClass =
                  "not-marked";


                if (
                  status === "Present"
                ) {

                  statusClass =
                    "present-day";

                }


                if (
                  status === "Absent"
                ) {

                  statusClass =
                    "absent-day";

                }


                return (

                  <div
                    key={day}
                    className={`calendar-day ${statusClass}`}
                  >

                    <strong>
                      {day}
                    </strong>


                    {status && (

                      <span>

                        {status === "Present"
                          ? "✓ Present"
                          : "✕ Absent"}

                      </span>

                    )}

                  </div>

                );

              }
            )}

          </div>

        </div>

      </div>

    </div>

  );

}

export default AttendanceCalendar;