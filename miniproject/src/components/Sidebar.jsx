
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div className="sidebar">
      <h2>Admin Panel</h2>

      <Link
        to="/dashboard"
        className={location.pathname === "/dashboard" ? "active" : ""}
      >
        🏠 Dashboard
      </Link>

      <Link
        to="/students"
        className={location.pathname === "/students" ? "active" : ""}
      >
        👨‍🎓 Students
      </Link>

      <Link
        to="/attendance"
        className={location.pathname === "/attendance" ? "active" : ""}
      >
        ✅ Attendance
      </Link>

      <Link
        to="/reports"
        className={location.pathname === "/reports" ? "active" : ""}
      >
        📊 Reports
      </Link>
    </div>
  );
}

export default Sidebar;
