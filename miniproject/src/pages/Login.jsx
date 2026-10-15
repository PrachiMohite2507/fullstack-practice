
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();

    // ADMIN LOGIN
    if (
      username.trim() === "admin" &&
      password === "admin123"
    ) {
      localStorage.setItem(
        "loggedInUser",
        JSON.stringify({ role: "admin" })
      );

      navigate("/dashboard", { replace: true });
    } else {
      alert("Invalid admin username or password");
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-icon">🎓</div>

        <h1>Student Attendance</h1>

        <p className="login-subtitle">
          Marking System
        </p>

        <form onSubmit={handleLogin}>
          <label>Admin Username</label>

          <input
            type="text"
            placeholder="Enter admin username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-button"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
