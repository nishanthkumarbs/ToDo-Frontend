import { useNavigate } from "react-router-dom";
import { FaTasks, FaCalendarAlt, FaBell } from "react-icons/fa";

const Landing = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-wrapper">

            {/* Floating icons */}
            <div className="floating-icons">
                <FaTasks className="float-icon icon1" />
                <FaCalendarAlt className="float-icon icon2" />
                <FaBell className="float-icon icon3" />
            </div>

            <div className="landing-card">

                <h1 className="landing-title">
                    Organize Your Life
                </h1>

                <p className="landing-subtitle">
                    A powerful Todo app with smart reminders, calendar view,
                    priorities and productivity tracking.
                </p>

                <div className="landing-buttons">
                    <button
                        className="login-btn"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="register-btn"
                        onClick={() => navigate("/register")}
                    >
                        Get Started
                    </button>
                </div>

                <div className="landing-features">

                    <div className="feature-card">
                        <FaTasks />
                        <span>Task Management</span>
                    </div>

                    <div className="feature-card">
                        <FaCalendarAlt />
                        <span>Calendar View</span>
                    </div>

                    <div className="feature-card">
                        <FaBell />
                        <span>Smart Reminders</span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default Landing;