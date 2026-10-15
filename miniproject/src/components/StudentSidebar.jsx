import { Link, useNavigate } from "react-router-dom";

function StudentSidebar() {

  const navigate = useNavigate();


  function handleLogout() {

    localStorage.removeItem("loggedInUser");

    navigate("/login");

  }


  return (

    <div className="student-sidebar">

      <h2>
        🎓 Student
      </h2>


      <Link to="/student-dashboard">
        🏠 Dashboard
      </Link>


      <Link to="/student-profile">
        👤 My Profile
      </Link>


      <Link to="/my-attendance">
        📊 My Attendance
      </Link>


      <Link to="/attendance-calendar">
        📅 Attendance Calendar
      </Link>


      <Link to="/attendance-analysis">
        📈 Attendance Analysis
      </Link>


      <button
        className="student-logout"
        onClick={handleLogout}
      >
        🚪 Logout
      </button>

    </div>

  );

}

export default StudentSidebar;