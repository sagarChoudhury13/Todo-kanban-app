import { useState, useEffect } from "react";
import "./App.css";
import { PlusIcon, RightArrowIcon, DeleteIcon } from "./assets/icon.jsx";
import TaskEntry from "./newEntry.jsx";

function App() {
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskCounter, setTaskCounter] = useState(0);

  const fetchTasks = async () => {
    try {
      const response = await fetch("http://localhost:5000/tasks", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setTasks(data);
      console.log(` this is task ${data}`);
    } catch (err) {
      console.log("route failed.");
    }
  };

  const handleSaveTask = async (newTaskdata) => {
    try {
      const response = await fetch("http://localhost:5000/tasks/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTaskdata),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (err) {
      console.log("failed to save task");
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
      }
    } catch (err) {
      console.log("failed to delete task");
    }
  };

  const handleTaskStatusChange = async (taskId, newStatus) => {

    if (taskCounter >= 3 && newStatus === "In-Progress") {
      alert("You can only have 3 tasks in-progress at a time.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const updatedTask = await response.json();
      setTasks(prevTasks => prevTasks.map(task => task._id === updatedTask._id ? updatedTask : task));
      if (newStatus === "In-Progress") {
        setTaskCounter(taskCounter + 1);
      }
      if (newStatus === "Done") {
        setTaskCounter(taskCounter - 1);
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <div className="title">
        <h1>Todo Kanban Board</h1>
        <button className="new-entry" onClick={() => setIsModalOpen(true)}>
          <PlusIcon className="plus-icon-style" />
        </button>
      </div>
      <div className="kanban-board">
        <div className="todo-group">
          <div className="tabs">Todo</div>
          <div className="todo">
            {tasks
              .filter((task) => task.status === "Todo")
              .sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
              })
              .map((task) => (
                <div className="task-card" key={task._id}>
                  <p className="task-title">
                    {task.title}{" "}
                    <div className="task-actions">
                      <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon className="delete-icon-style" />
                      </button>
                    <button
                      className="right-arrow"
                      onClick={() =>
                        handleTaskStatusChange(task._id, "In-Progress")
                      }
                    >
                      <RightArrowIcon className="right-icon-style" />
                    </button>
                    </div>
                  </p>
                  <p className="task-desc">{task.description}</p>
                </div>
              ))}
          </div>
        </div>
        <div className="todo-group">
          <div className="tabs">In - Progress</div>
          <div className="in-progress">
            {tasks
              .filter((task) => task.status === "In-Progress")
              .sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
              })
              .map((task) => (
                <div className="task-card" key={task._id}>
                  <p className="task-title">
                    {task.title}{" "}
                    <button
                      className="right-arrow"
                      onClick={() => handleTaskStatusChange(task._id, "Done")}
                    >
                      <RightArrowIcon className="right-icon-style" />
                    </button>
                  </p>
                  <p className="task-desc">{task.description}</p>
                </div>
              ))}
              <span className="wip-line" style={{ display: taskCounter >= 3 ? "block" : "none", color: "#717171" , fontSize: "12px" }}>
                ------- WIP Limit-------
              </span>
          </div>
        </div>
        <div className="todo-group">
          <div className="tabs">Done</div>
          <div className="done">
            {tasks
              .filter((task) => task.status === "Done")
              .sort((a, b) => {
                return new Date(a.createdAt) - new Date(b.createdAt);
              })
              .map((task) => (
                <div className="task-card" key={task._id}>
                  <p className="task-title">{task.title} <button className="delete-button" onClick={() => handleDeleteTask(task._id)}>
                        <DeleteIcon className="delete-icon-style" />
                      </button></p>
                  <p className="task-desc">{task.description}</p>
                </div>
              ))}
          </div>
        </div>
      </div>
      <TaskEntry
        isOpen={isModalOpen}
        isClose={() => setIsModalOpen(false)}
        isSave={handleSaveTask}
      />
    </div>
  );
}

export default App;
