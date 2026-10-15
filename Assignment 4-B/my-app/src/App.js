
import { useState } from "react";
import "./App.css";

function App() {
  const [task, setTask] = useState("");
  const [tasks, setTasks] = useState([]);

  function addTask() {
    if (task.trim() === "") {
      alert("Please enter a task!");
      return;
    }

    setTasks([
      ...tasks,
      { id: Date.now(), text: task, completed: false }
    ]);

    setTask("");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((item) =>
        item.id === id
          ? { ...item, completed: !item.completed }
          : item
      )
    );
  }

  function deleteTask(id) {
    setTasks(tasks.filter((item) => item.id !== id));
  }

  return (
    <div className="container">
      <h1>My To-Do List 📝</h1>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter your task..."
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />

        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            <span
              onClick={() => toggleTask(item.id)}
              className={item.completed ? "completed" : ""}
            >
              {item.text}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteTask(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      <p>Total Tasks: {tasks.length}</p>
      <p>
        Completed: {tasks.filter((item) => item.completed).length}
      </p>
    </div>
  );
}

export default App;
