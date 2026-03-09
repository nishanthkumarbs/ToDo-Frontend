import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../services/api";
import { saveSession, getSessionUser } from "../services/auth";

const Login = ({ setUser }) => {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleLogin = async (e) => {

        e.preventDefault();
        setLoading(true);

        try {

            const res = await loginUser(
                loginData.email.trim(),
                loginData.password.trim()
            );

            saveSession(res.token, res.user);

            setUser(getSessionUser());

            toast.success("Login Successful!");
            navigate("/");

        } catch (error) {

            if (error.message === "USER_NOT_FOUND") {
                toast.error("User not found!");
            }
            else if (error.message === "INVALID_PASSWORD") {
                toast.error("Wrong password!");
            }
            else {
                toast.error("Login failed!");
            }

        } finally {
            setLoading(false);
        }

    };

    return (

        <>
            <div className="auth-page">

                <div className="auth-card">

                    <h2 className="auth-title">Welcome back</h2>

                    <p className="auth-subtitle">
                        Login to manage your tasks and stay productive.
                    </p>

                    <form onSubmit={handleLogin} className="auth-form">

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={loginData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="input-group password-wrapper">
                            <label>Password</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Enter your password"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button type="submit" className="auth-btn">
                            Login
                        </button>

                    </form>

                    <p className="auth-switch">
                        Don’t have an account?
                        <span onClick={() => navigate("/register")}> Register</span>
                    </p>

                </div>

            </div>

            <ToastContainer position="top-right" autoClose={2000} />
        </>

    );

};

export default Login;