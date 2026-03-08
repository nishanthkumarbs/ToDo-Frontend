import { useState, useEffect, useRef } from "react";
import { createTodo } from "../services/api";
import {
    FaCalendarAlt,
    FaFlag,
    FaRedo,
    FaBell,
    FaTag,
} from "react-icons/fa";

const TodoForm = ({ fetchTodos }) => {
    const [title, setTitle] = useState("");
    const [priority, setPriority] = useState("medium");
    const [dueDate, setDueDate] = useState("");
    const [category, setCategory] = useState("work");
    const [repeat, setRepeat] = useState("none");
    const [reminder, setReminder] = useState("");
    const wrapperRef = useRef(null);

    const [activeMenu, setActiveMenu] = useState(null);
    // "date" | "reminder" | "repeat" | "category" | "priority"

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            const user = JSON.parse(localStorage.getItem("user"));

            await createTodo({
                title,
                completed: false,
                priority,
                dueDate,
                category,
                repeat,
                reminder,
                createdAt: new Date().toISOString(),
                userId: user.id   // 🔥 important
            });

            setTitle("");
            setDueDate("");
            setCategory("work");
            setRepeat("none");
            setReminder("");
            setPriority("medium");

            fetchTodos();
        } catch (error) {
            console.error("Error adding todo:", error);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target)
            ) {
                setActiveMenu(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="task-bar-wrapper" ref={wrapperRef}>
            <form onSubmit={handleSubmit} autoComplete="off" className="task-bar">

                <div className="input-tooltip-wrapper">
                    <input
                        type="text"
                        placeholder="Enter todos..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="task-input"
                        autoComplete="off"
                    />

                    <div className="input-tooltip">
                        Add a new task
                    </div>
                </div>

                <div className="task-actions">

                    <div className="tooltip-wrapper">
                        <FaCalendarAlt
                            className="task-icon"
                            onClick={() => setActiveMenu("date")}
                        />
                        <div className="tooltip-box">Due Date</div>
                    </div>

                    <div className="tooltip-wrapper">
                        <FaBell
                            className="task-icon"
                            onClick={() => setActiveMenu("reminder")}
                        />
                        <div className="tooltip-box">Reminder</div>
                    </div>

                    <div className="tooltip-wrapper">
                        <FaRedo
                            className="task-icon"
                            onClick={() => setActiveMenu("repeat")}
                        />
                        <div className="tooltip-box">Repeat</div>
                    </div>

                    <div className="tooltip-wrapper">
                        <FaTag
                            className="task-icon"
                            onClick={() => setActiveMenu("category")}
                        />
                        <div className="tooltip-box">Category</div>
                    </div>

                    <div className="tooltip-wrapper">
                        <FaFlag
                            className="task-icon"
                            onClick={() => setActiveMenu("priority")}
                        />
                        <div className="tooltip-box">Priority</div>
                    </div>

                </div>
            </form>

            {/* DATE MENU */}
            {activeMenu === "date" && (
                <div className="floating-menu">
                    <div
                        className="menu-item"
                        onClick={() => {
                            setDueDate(new Date().toISOString().split("T")[0]);
                            setActiveMenu(null);
                        }}
                    >
                        Today
                    </div>

                    <div
                        className="menu-item"
                        onClick={() => {
                            const tomorrow = new Date();
                            tomorrow.setDate(tomorrow.getDate() + 1);
                            setDueDate(tomorrow.toISOString().split("T")[0]);
                            setActiveMenu(null);
                        }}
                    >
                        Tomorrow
                    </div>

                    <div className="menu-item">
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* REMINDER MENU */}
            {activeMenu === "reminder" && (
                <div className="floating-menu">
                    <div className="menu-item">
                        <input
                            type="datetime-local"
                            value={reminder}
                            onChange={(e) => setReminder(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* REPEAT MENU */}
            {activeMenu === "repeat" && (
                <div className="floating-menu">
                    {["none", "daily", "weekly", "monthly"].map((r) => (
                        <div
                            key={r}
                            className="menu-item"
                            onClick={() => {
                                setRepeat(r);
                                setActiveMenu(null);
                            }}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </div>
                    ))}
                </div>
            )}

            {/* CATEGORY MENU */}
            {activeMenu === "category" && (
                <div className="floating-menu">
                    {["work", "personal", "study", "health"].map((c) => (
                        <div
                            key={c}
                            className="menu-item"
                            onClick={() => {
                                setCategory(c);
                                setActiveMenu(null);
                            }}
                        >
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </div>
                    ))}
                </div>
            )}

            {/* PRIORITY MENU */}
            {activeMenu === "priority" && (
                <div className="floating-menu">
                    {["low", "medium", "high"].map((p) => (
                        <div
                            key={p}
                            className="menu-item"
                            onClick={() => {
                                setPriority(p);
                                setActiveMenu(null);
                            }}
                        >
                            {p.charAt(0).toUpperCase() + p.slice(1)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TodoForm;