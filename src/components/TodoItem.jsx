import { updateTodo } from "../services/api";
import { FaCalendarAlt } from "react-icons/fa";

const TodoItem = ({ todo, fetchTodos, setSelectedTask }) => {

    const handleToggle = async (e) => {
        e.stopPropagation(); // prevent opening sidebar

        const user = JSON.parse(localStorage.getItem("user"));

        // 🔐 Ownership check
        if (!user || todo.userId !== user.id) {
            alert("Unauthorized action!");
            return;
        }

        try {
            await updateTodo(todo.id, {
                ...todo,
                completed: !todo.completed,
                completedAt: !todo.completed
                    ? new Date().toISOString()
                    : null
            });

            fetchTodos();
        } catch (error) {
            console.error("Error updating todo:", error);
        }
    };

    const getDaysLeft = (dueDate) => {
        if (!dueDate) return null;

        const today = new Date();
        const due = new Date(dueDate);

        today.setHours(0, 0, 0, 0);
        due.setHours(0, 0, 0, 0);

        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        return diffDays;
    };

    const daysLeft = getDaysLeft(todo.dueDate);

    return (
        <li
            className="todo-item"
            onClick={() => setSelectedTask(todo)}
        >
            <div className="todo-content">
                <span
                    onClick={handleToggle}
                    className={`${todo.completed ? "completed" : ""} priority-${todo.priority}`}
                >
                    {todo.title}
                </span>

                {todo.category && (
                    <span className={`category-badge category-${todo.category}`}>
                        {todo.category}
                    </span>
                )}

                {todo.dueDate && (
                    <div
                        className={`due-date-row ${daysLeft < 0
                            ? "due-overdue"
                            : daysLeft === 0
                                ? "due-today"
                                : ""
                            }`}
                    >
                        <span className="due-label">
                            <FaCalendarAlt className="due-icon" />
                            Due:
                        </span>

                        <span className="due-value">
                            {new Date(todo.dueDate).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                            })}
                        </span>
                    </div>
                )}
            </div>

            {daysLeft !== null && (
                <span
                    className={`countdown-badge ${daysLeft < 0
                        ? "overdue"
                        : daysLeft === 0
                            ? "today"
                            : daysLeft <= 2
                                ? "warning"
                                : "safe"
                        }`}
                >
                    {daysLeft > 0
                        ? `${daysLeft} day${daysLeft > 1 ? "s" : ""} left`
                        : daysLeft === 0
                            ? "Due today"
                            : "Overdue"}
                </span>
            )}
        </li>
    );
};

export default TodoItem;