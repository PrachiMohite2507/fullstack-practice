import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

function MyAttendance() {

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);

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


    const records = [];


    Object.keys(savedAttendance).forEach(
      (date) => {

        const status =
          savedAttendance[date][loggedInUser.id];

        if (status) {

          records.push({
            date: date,
            status: status
          });

        }

      }
    );


    setAttendance(records);

  }, []);


  if (!student) {

    return (
      <div className="student-content">
        <h2>Student not logged in</h2>
      </div>
    );

  }


  const present =
    attendance.filter(
      (record) => record.status === "Present"
    ).length;


  const absent =
    attendance.filter(
      (record) => record.status === "Absent"
    ).length;


  const total =
    present + absent;


  const percentage =
    total > 0
      ? Math.round((present / total) * 100)
      : 0;


  return (

    <div className="student-layout">

      <StudentSidebar />


      <div className="student-content">

        <h1>
          My Attendance 📊
        </h1>

        <p>
          View your complete attendance record.
        </p>


        {/* ATTENDANCE CARDS */}

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


          <div className="student-card">

            <span>📈</span>

            <p>
              Attendance
            </p>

            <h2>
              {percentage}%
            </h2>

          </div>

        </div>


        {/* ATTENDANCE TABLE */}

        <div className="profile-card">

          <div className="profile-title">

            <h2>
              Attendance Records
            </h2>

          </div>


          {attendance.length === 0 ? (

            <p>
              No attendance records found.
            </p>

          ) : (

            <table>

              <thead>

                <tr>

                  <th>
                    Date
                  </th>

                  <th>
                    Status
                  </th>

                </tr>

              </thead>


              <tbody>

                {attendance.map(
                  (record, index) => (

                    <tr key={index}>

                      <td>
                        {record.date}
                      </td>

                      <td>
                        {record.status === "Present"
                          ? "✅ Present"
                          : "❌ Absent"}
                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </div>

  );
}

export default MyAttendance;