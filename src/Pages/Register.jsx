import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { registerUser } from "../services/api";

const Register = () => {
    const navigate = useNavigate();

    const [registerData, setRegisterData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            await registerUser({
                name: registerData.name.trim(),
                email: registerData.email.trim(),
                password: registerData.password.trim()
            });

            toast.success("Registration successful!");
            navigate("/login");

        } catch (error) {
            if (error.message === "EMAIL_EXISTS") {
                toast.error("Email already registered!");
            } else {
                toast.error("Registration failed!");
            }
        }
    };

    const isRegisterValid =
        passwordChecks.length &&
        passwordChecks.uppercase &&
        passwordChecks.number &&
        passwordChecks.special &&
        registerData.password === registerData.confirmPassword;

    return (
        <>
            <div className="auth-page">

                <div className="auth-card">

                    <h2 className="auth-title">Create your account</h2>

                    <p className="auth-subtitle">
                        Start organizing your tasks and boost productivity.
                    </p>

                    <form onSubmit={handleRegister} className="auth-form">

                        <div className="input-group">
                            <label>Name</label>
                            <input
                                type="text"
                                name="name"
                                placeholder="John Doe"
                                value={registerData.name}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        name: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={registerData.email}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        email: e.target.value
                                    })
                                }
                                required
                            />
                        </div>

                        {/* Password */}
                        <div className="input-group password-wrapper">
                            <label>Password</label>

                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a strong password"
                                value={registerData.password}
                                onChange={(e) => {
                                    const value = e.target.value;

                                    setRegisterData({
                                        ...registerData,
                                        password: value
                                    });

                                    setPasswordChecks({
                                        length: value.length >= 6,
                                        uppercase: /[A-Z]/.test(value),
                                        number: /[0-9]/.test(value),
                                        special: /[^A-Za-z0-9]/.test(value)
                                    });
                                }}
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        {/* Password rules */}
                        {registerData.password && (
                            <div className="password-checklist">
                                <p className={passwordChecks.length ? "valid" : "invalid"}>
                                    ✔ At least 6 characters
                                </p>

                                <p className={passwordChecks.uppercase ? "valid" : "invalid"}>
                                    ✔ One uppercase letter
                                </p>

                                <p className={passwordChecks.number ? "valid" : "invalid"}>
                                    ✔ One number
                                </p>

                                <p className={passwordChecks.special ? "valid" : "invalid"}>
                                    ✔ One special character
                                </p>
                            </div>
                        )}

                        {/* Confirm password */}
                        <div className="input-group password-wrapper">
                            <label>Confirm Password</label>

                            <input
                                type={showConfirm ? "text" : "password"}
                                value={registerData.confirmPassword}
                                onChange={(e) =>
                                    setRegisterData({
                                        ...registerData,
                                        confirmPassword: e.target.value
                                    })
                                }
                                required
                            />

                            <span
                                className="password-toggle"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <button
                            type="submit"
                            disabled={!isRegisterValid}
                            className="auth-btn"
                        >
                            Create Account
                        </button>

                    </form>

                    <p className="auth-switch">
                        Already have an account?
                        <span onClick={() => navigate("/login")}> Login</span>
                    </p>

                </div>

            </div>
            <ToastContainer position="top-right" autoClose={2000} />
        </>
    );
};

export default Register;