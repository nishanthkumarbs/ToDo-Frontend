import { updateTodo, createTodo } from "../services/api";
import { getSessionUser } from "../services/auth";
import { FaCalendarAlt } from "react-icons/fa";

const TodoItem = ({ todo, fetchTodos, setSelectedTask }) => {

    const handleToggle = async (e) => {
        e.stopPropagation(); // prevent opening sidebar

        const user = getSessionUser();

        // 🔐 Ownership check
        if (!user || todo.userId !== user.id) {
            alert("Unauthorized action!");
            return;
        }

        try {
            const isCompleting = !todo.completed;

            await updateTodo(todo.id, {
                ...todo,
                completed: isCompleting,
                completedAt: isCompleting ? new Date().toISOString() : null
            });

            // ✅ If marking as completed AND it has a repeat pattern, create the next occurrence
            if (isCompleting && todo.repeat && todo.repeat !== "none" && todo.dueDate) {
                const currentDue = new Date(todo.dueDate);
                const nextDue = new Date(currentDue);

                if (todo.repeat === "daily") {
                    nextDue.setDate(nextDue.getDate() + 1);
                } else if (todo.repeat === "weekly") {
                    nextDue.setDate(nextDue.getDate() + 7);
                } else if (todo.repeat === "monthly") {
                    nextDue.setMonth(nextDue.getMonth() + 1);
                }

                await createTodo({
                    title: todo.title,
                    completed: false,
                    priority: todo.priority,
                    category: todo.category,
                    repeat: todo.repeat,
                    reminder: todo.reminder,
                    dueDate: nextDue.toISOString().split("T")[0],
                    createdAt: new Date().toISOString(),
                    userId: user.id
                });
            }

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