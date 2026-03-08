import { useEffect, useState, useRef } from "react";
import { getTodos, deleteTodo, createTodo } from "./services/api";
import TodoList from "./components/TodoList";
import TodoForm from "./components/TodoForm";
import "./styles/App.css";
import { FaMoon, FaSun, FaUserCog } from "react-icons/fa";
import TaskSidebar from "./components/TaskSidebar";
import CalendarView from "./components/CalendarView";
import { FaSearch } from "react-icons/fa";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Profile from "./Pages/Profile";
import Landing from "./Pages/LandingPage";

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("none");
  const [selectedTask, setSelectedTask] = useState(null);
  const [notifiedTasks, setNotifiedTasks] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const [showUndo, setShowUndo] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const profileRef = useRef(null);

  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const savedAvatar = user?.avatar;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setProfileOpen(false);
    setUser(null);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setProfileOpen(false);
  }, [user]);

  const getAvatarColor = (name) => {
    const colors = ["#667eea", "#f06595", "#20c997", "#fab005", "#4dabf7"];
    const index = name?.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem("darkMode");
    return savedTheme === "true";
  });

  useEffect(() => {
    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission();
      }
    }
  }, []);

  useEffect(() => {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "granted") return;

    const timeouts = [];

    todos.forEach((todo) => {
      if (!todo.reminder) return;

      const reminderTime = new Date(todo.reminder);
      const now = new Date();

      const delay = reminderTime - now;

      // Only schedule future reminders
      if (delay > 0) {
        const timeout = setTimeout(() => {
          new Notification("⏰ Task Reminder", {
            body: todo.title,
          });
        }, delay);

        timeouts.push(timeout);
      }
    });

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout));
    };
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const fetchTodos = async () => {

    try {

      if (!user) {
        setTodos([]);
        return;
      }

      setLoading(true);
      setError(null);

      const response = await getTodos(user.id);

      setTodos(response.data);

    } catch (err) {

      setError("Failed to fetch todos.");
      console.error(err);

    } finally {
      setLoading(false);
    }

  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    try {
      await Promise.all(
        completedTodos.map(todo => deleteTodo(todo.id))
      );
      fetchTodos();
    } catch (error) {
      console.error("Error clearing completed todos:", error);
    }
  };

  const totalCount = todos.length;
  const completedCount = todos.filter(todo => todo.completed).length;
  const pendingCount = totalCount - completedCount;

  useEffect(() => {
    fetchTodos();
  }, [user]);

  const priorityRank = {
    high: 3,
    medium: 2,
    low: 1
  };

  let filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "pending") return !todo.completed;
      return true;
    })
    .filter((todo) =>
      todo.title.toLowerCase().includes(search.toLowerCase())
    );

  filteredTodos = [...filteredTodos].sort((a, b) => {

    // PRIORITY: High → Low
    if (sortOrder === "priority-desc") {
      return priorityRank[b.priority] - priorityRank[a.priority];
    }

    // PRIORITY: Low → High
    if (sortOrder === "priority-asc") {
      return priorityRank[a.priority] - priorityRank[b.priority];
    }

    // DUE DATE: Earliest First
    if (sortOrder === "date-asc") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }

    // DUE DATE: Latest First
    if (sortOrder === "date-desc") {
      if (!a.dueDate && !b.dueDate) return 0;
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(b.dueDate) - new Date(a.dueDate);
    }

    // COMBINED: Due Date → Then Priority
    if (sortOrder === "date-priority") {

      // First compare due dates
      if (a.dueDate && b.dueDate) {
        const dateDiff =
          new Date(a.dueDate) - new Date(b.dueDate);

        if (dateDiff !== 0) return dateDiff;
      }

      // If same date OR no date → compare priority
      return priorityRank[b.priority] - priorityRank[a.priority];
    }

    return 0;
  });

  const handleDeleteWithUndo = async (task) => {
    const user = JSON.parse(localStorage.getItem("user"));

    // 🔐 Ownership check
    if (!user || task.userId !== user.id) {
      alert("Unauthorized action!");
      return;
    }

    try {
      await deleteTodo(task.id);

      setRecentlyDeleted(task);
      setShowUndo(true);

      setTimeout(() => {
        setShowUndo(false);
        setRecentlyDeleted(null);
      }, 5000);

      fetchTodos();
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          !user ? (
            <Login setUser={setUser} />
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* REGISTER */}
      <Route
        path="/register"
        element={!user ? <Register /> : <Navigate to="/" />}
      />

      <Route
        path="/profile"
        element={
          user ? (
            <Profile
              darkMode={darkMode}
              setUser={setUser}   // 🔥 pass this
            />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* PROTECTED HOME */}
      <Route
        path="/"
        element={
          user ? (
            <>
              <div className="background-overlay">
                <div className={`app-container ${darkMode ? "dark" : ""}`}>

                  <button
                    className="dark-toggle"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? <FaSun /> : <FaMoon />}
                  </button>

                  <div className="top-bar">
                    <div className="profile-wrapper" ref={profileRef}>
                      <div
                        className="avatar-circle"
                        style={{
                          background: savedAvatar
                            ? "transparent"
                            : getAvatarColor(user?.name)
                        }}
                        onClick={() => setProfileOpen(!profileOpen)}
                      >
                        {savedAvatar ? (
                          <img src={savedAvatar} alt="avatar" className="avatar-img" />
                        ) : (
                          user?.name?.charAt(0).toUpperCase()
                        )}
                      </div>
                      {profileOpen && (
                        <div className="profile-dropdown">
                          <p className="profile-name">{user?.name}</p>
                          <p className="profile-email">{user?.email}</p>

                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-item"
                            onClick={() => navigate("/profile")}
                          >
                            <FaUserCog style={{ marginRight: "8px" }} />
                            Profile Settings
                          </button>

                          <button onClick={handleLogout} className="dropdown-logout">
                            Logout
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <h1>Todo App</h1>

                  {loading && <p className="loading">Loading...</p>}
                  {error && <p className="error">{error}</p>}

                  <TodoForm fetchTodos={fetchTodos} />

                  <div className="task-stats">
                    <p>Total: {totalCount}</p>
                    <p>Completed: {completedCount}</p>
                    <p>Pending: {pendingCount}</p>
                  </div>

                  <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      placeholder="Search todos..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="search-input"
                    />
                  </div>

                  <div className="filter-buttons">
                    <button
                      className={filter === "all" ? "active-filter" : ""}
                      onClick={() => setFilter("all")}
                    >
                      All
                    </button>

                    <button
                      className={filter === "completed" ? "active-filter" : ""}
                      onClick={() => setFilter("completed")}
                    >
                      Completed
                    </button>

                    <button
                      className={filter === "pending" ? "active-filter" : ""}
                      onClick={() => setFilter("pending")}
                    >
                      Pending
                    </button>
                  </div>

                  <div className="sort-container">
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="sort-select"
                    >
                      <option value="none">Sort Options</option>
                      <option value="priority-desc">Priority: High → Low</option>
                      <option value="priority-asc">Priority: Low → High</option>
                      <option value="date-asc">Due Date: Earliest First</option>
                      <option value="date-desc">Due Date: Latest First</option>
                      <option value="date-priority">Due Date → Then Priority</option>
                    </select>
                  </div>

                  {completedCount > 0 && (
                    <button className="clear-btn" onClick={clearCompleted}>
                      Clear Completed
                    </button>
                  )}

                  <div className="view-toggle">
                    <button
                      className={viewMode === "list" ? "active-view" : ""}
                      onClick={() => setViewMode("list")}
                    >
                      List View
                    </button>

                    <button
                      className={viewMode === "calendar" ? "active-view" : ""}
                      onClick={() => setViewMode("calendar")}
                    >
                      Calendar View
                    </button>
                  </div>

                  {viewMode === "list" ? (
                    <TodoList
                      todos={filteredTodos}
                      fetchTodos={fetchTodos}
                      setTodos={setTodos}
                      setSelectedTask={setSelectedTask}
                    />
                  ) : (
                    <CalendarView
                      todos={filteredTodos}
                      setSelectedTask={setSelectedTask}
                    />
                  )}

                </div>
              </div>

              <TaskSidebar
                darkMode={darkMode}
                selectedTask={selectedTask}
                setSelectedTask={setSelectedTask}
                closeSidebar={() => setSelectedTask(null)}
                refreshTodos={fetchTodos}
                handleDeleteWithUndo={handleDeleteWithUndo}
              />

              {showUndo && recentlyDeleted && (
                <div className="undo-toast">
                  Task deleted
                  <button
                    onClick={async () => {
                      await createTodo({
                        ...recentlyDeleted,
                        id: undefined
                      });
                      await fetchTodos();
                      setShowUndo(false);
                      setRecentlyDeleted(null);
                      setSelectedTask(null);
                    }}
                  >
                    Undo
                  </button>
                </div>
              )}
            </>
          ) : (
            <Landing />
          )
        }
      />

    </Routes>
  );
}

export default App;