
import "./App.css";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

// PROTECTED ADMIN ROUTE
function AdminRoute({ children }) {
  const savedUser = localStorage.getItem("loggedInUser");

  if (!savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (user.role !== "admin") {
      localStorage.removeItem("loggedInUser");
      return <Navigate to="/login" replace />;
    }
  } catch {
    localStorage.removeItem("loggedInUser");
    return <Navigate to="/login" replace />;
  }

  return children;
}

// HOME PAGE
function HomeRedirect() {
  const savedUser = localStorage.getItem("loggedInUser");

  if (savedUser) {
    try {
      const user = JSON.parse(savedUser);

      if (user.role === "admin") {
        return <Navigate to="/dashboard" replace />;
      }
    } catch {
      localStorage.removeItem("loggedInUser");
    }
  }

  return <Navigate to="/login" replace />;
}

// APP LAYOUT
function AppLayout() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";

  return (
    <>
      {!isLoginPage && (
        <header>
          <h2>Student Attendance Marking System</h2>

          <span
            className="user-badge"
            onClick={() => {
              localStorage.removeItem("loggedInUser");
              window.location.replace("/login");
            }}
            style={{ cursor: "pointer" }}
          >
            👤 Admin | Logout 🚪
          </span>
        </header>
      )}

      <div className={isLoginPage ? "" : "layout"}>
        {!isLoginPage && <Sidebar />}

        <main>
          <Routes>
            {/* ADMIN LOGIN */}
            <Route path="/login" element={<Login />} />

            {/* HOME */}
            <Route path="/" element={<HomeRedirect />} />

            {/* ADMIN DASHBOARD */}
            <Route
              path="/dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />

            {/* STUDENT CRUD */}
            <Route
              path="/students"
              element={
                <AdminRoute>
                  <Students />
                </AdminRoute>
              }
            />

            {/* ATTENDANCE MARKING */}
            <Route
              path="/attendance"
              element={
                <AdminRoute>
                  <Attendance />
                </AdminRoute>
              }
            />

            {/* ATTENDANCE REPORTS */}
            <Route
              path="/reports"
              element={
                <AdminRoute>
                  <Reports />
                </AdminRoute>
              }
            />

            {/* UNKNOWN URL */}
            <Route
              path="*"
              element={<Navigate to="/login" replace />}
            />
          </Routes>
        </main>
      </div>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
