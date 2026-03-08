import { useState, useMemo } from "react";

const CalendarView = ({ todos, setSelectedTask }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // First day of current month
    const firstDayOfMonth = new Date(year, month, 1);

    // Total days in month
    const lastDateOfMonth = new Date(year, month + 1, 0).getDate();

    // Day index month starts on (0 = Sunday)
    const startDay = firstDayOfMonth.getDay();

    // Generate calendar days
    const days = useMemo(() => {
        const calendarDays = [];

        // Empty cells before month starts
        for (let i = 0; i < startDay; i++) {
            calendarDays.push(null);
        }

        // Actual month days
        for (let date = 1; date <= lastDateOfMonth; date++) {
            calendarDays.push(new Date(year, month, date));
        }

        return calendarDays;
    }, [year, month, startDay, lastDateOfMonth]);

    // Group tasks by dueDate (SAFE)
    const tasksByDate = useMemo(() => {
        const grouped = {};

        todos.forEach((todo) => {
            if (!todo.dueDate) return;

            grouped[todo.dueDate] = grouped[todo.dueDate] || [];
            grouped[todo.dueDate].push(todo);
        });

        return grouped;
    }, [todos]);

    // Today's date (for highlight)
    const today = new Date();

    return (
        <div className="calendar-container">
            {/* HEADER */}
            <div className="calendar-header-bar">
                <button
                    onClick={() =>
                        setCurrentDate(new Date(year, month - 1, 1))
                    }
                >
                    ◀
                </button>

                <h2>
                    {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                    })}
                </h2>

                <button
                    onClick={() =>
                        setCurrentDate(new Date(year, month + 1, 1))
                    }
                >
                    ▶
                </button>
            </div>

            {/* GRID */}
            <div className="calendar-grid">
                {/* Week Headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                        <div key={day} className="calendar-header">
                            {day}
                        </div>
                    )
                )}

                {/* Calendar Cells */}
                {days.map((date, index) => {
                    if (!date) {
                        return (
                            <div
                                key={index}
                                className="calendar-cell empty"
                            />
                        );
                    }

                    // SAFE date formatting (no timezone issue)
                    const formattedDate =
                        date.toLocaleDateString("en-CA");

                    const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();

                    return (
                        <div
                            key={index}
                            className={`calendar-cell ${isToday ? "today-cell" : ""
                                }`}
                        >
                            <div className="calendar-date">
                                {date.getDate()}
                            </div>

                            {tasksByDate[formattedDate]?.map(
                                (task) => (
                                    <div
                                        key={task.id}
                                        className="calendar-task"
                                        onClick={() =>
                                            setSelectedTask(task)
                                        }
                                    >
                                        {task.title}
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;