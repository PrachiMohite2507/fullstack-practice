import { useState, useEffect } from "react";

function Students() {
  const API_URL = "http://localhost:5000/api/students";

  const [students, setStudents] = useState([]);
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch students from MongoDB backend
  useEffect(() => {
    async function fetchStudents() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
        alert("Unable to load students. Check backend server.");
      } finally {
        setLoading(false);
      }
    }

    fetchStudents();
  }, []);

  // Add or Update Student
  async function addStudent() {
    if (name.trim() === "" || String(rollNo).trim() === "") {
      alert("Please enter student name and roll number");
      return;
    }

    if (editId === null && password.trim() === "") {
      alert("Please enter password");
      return;
    }

    try {
      const studentData = {
        name: name.trim(),
        rollNo: Number(rollNo)
      };

      // Password is required when adding a student.
      // During editing, it is optional.
      if (password.trim() !== "") {
        studentData.password = password;
      }

      const response = await fetch(
        editId !== null
          ? `${API_URL}/${editId}`
          : API_URL,
        {
          method: editId !== null ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(studentData)
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      if (editId !== null) {
        setStudents((previousStudents) =>
          previousStudents.map((student) =>
            student._id === editId ? data.student : student
          )
        );

        alert("Student updated successfully");
      } else {
        setStudents((previousStudents) => [
          ...previousStudents,
          data.student
        ]);

        alert("Student added successfully");
      }

      // Clear form
      setName("");
      setRollNo("");
      setPassword("");
      setEditId(null);

    } catch (error) {
      console.error("Error saving student:", error);
      alert(error.message);
    }
  }

  // Edit Student
  function editStudent(student) {
    setName(student.name);
    setRollNo(student.rollNo);
    setPassword("");
    setEditId(student._id);
  }

  // Delete Student
  async function deleteStudent(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE"
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete student");
      }

      setStudents((previousStudents) =>
        previousStudents.filter((student) => student._id !== id)
      );

      alert("Student deleted successfully");

      if (editId === id) {
        setName("");
        setRollNo("");
        setPassword("");
        setEditId(null);
      }

    } catch (error) {
      console.error("Error deleting student:", error);
      alert(error.message);
    }
  }

  // Cancel editing
  function cancelEdit() {
    setName("");
    setRollNo("");
    setPassword("");
    setEditId(null);
  }

  return (
    <div>
      <h1>Students</h1>

      {/* Search Student */}
      <input
        type="text"
        placeholder="Search student..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Student Form */}
      <div className="student-form">

        <input
          type="text"
          placeholder="Enter student name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter roll number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
        />

        <input
          type="password"
          placeholder={
            editId !== null
              ? "New password (optional)"
              : "Enter password"
          }
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={addStudent}>
          {editId !== null ? "Update Student" : "Add Student"}
        </button>

        {editId !== null && (
          <button onClick={cancelEdit}>
            Cancel
          </button>
        )}
      </div>

      {/* Student Table */}
      {loading ? (
        <p>Loading students...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {students
              .filter((student) =>
                student.name
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                String(student.rollNo).includes(search)
              )
              .map((student) => (
                <tr key={student._id}>
                  <td>{student.rollNo}</td>
                  <td>{student.name}</td>
                  <td>
                    <button onClick={() => editStudent(student)}>
                      Edit
                    </button>

                    <button onClick={() => deleteStudent(student._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {students.length > 0 &&
              students.filter((student) =>
                student.name
                  .toLowerCase()
                  .includes(search.toLowerCase()) ||
                String(student.rollNo).includes(search)
              ).length === 0 && (
                <tr>
                  <td colSpan="3">No matching students found</td>
                </tr>
              )}

            {students.length === 0 && (
              <tr>
                <td colSpan="3">No students available</td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Students;