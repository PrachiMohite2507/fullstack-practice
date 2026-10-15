import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";

function StudentProfile() {

  const [student, setStudent] = useState(null);

  useEffect(() => {

    const savedUser =
      localStorage.getItem("loggedInUser");

    if (savedUser) {

      const loggedInUser =
        JSON.parse(savedUser);

      setStudent(loggedInUser);

    }

  }, []);


  if (!student) {

    return (
      <div className="student-content">
        <h2>Student not logged in</h2>
      </div>
    );

  }


  return (

    <div className="student-layout">

      {/* STUDENT SIDEBAR */}

      <StudentSidebar />


      {/* PROFILE CONTENT */}

      <div className="student-content">

        <div className="profile-header">

          <div className="profile-avatar">
            👨‍🎓
          </div>

          <div>

            <h1>
              My Profile
            </h1>

            <p>
              View your student information
            </p>

          </div>

        </div>


        {/* PROFILE CARD */}

        <div className="profile-card">

          <div className="profile-title">

            <h2>
              Student Information
            </h2>

          </div>


          <div className="profile-details">


            {/* NAME */}

            <div className="profile-item">

              <span>👤</span>

              <div>

                <small>
                  Full Name
                </small>

                <h3>
                  {student.name}
                </h3>

              </div>

            </div>


            {/* ROLL NUMBER */}

            <div className="profile-item">

              <span>🎓</span>

              <div>

                <small>
                  Roll Number
                </small>

                <h3>
                  {student.rollNo}
                </h3>

              </div>

            </div>


            {/* ROLE */}

            <div className="profile-item">

              <span>📚</span>

              <div>

                <small>
                  Role
                </small>

                <h3>
                  Student
                </h3>

              </div>

            </div>


            {/* ACCOUNT */}

            <div className="profile-item">

              <span>🔐</span>

              <div>

                <small>
                  Account
                </small>

                <h3>
                  Active
                </h3>

              </div>

            </div>


          </div>

        </div>

      </div>

    </div>

  );
}

export default StudentProfile;