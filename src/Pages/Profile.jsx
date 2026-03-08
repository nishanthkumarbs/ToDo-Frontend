import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import API from "../services/api";

const Profile = ({ darkMode, setUser }) => {
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        uppercase: false,
        number: false,
        special: false
    });
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const [avatarPreview, setAvatarPreview] = useState(storedUser?.avatar || null);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false)
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(storedUser?.name || "");

    const handleSave = async () => {
        try {
            // Update user in db.json
            const res = await axios.patch(
                `http://localhost:5000/users/${storedUser.id}`,
                { name }
            );

            // Update localStorage
            localStorage.setItem("user", JSON.stringify(res.data));
            setUser(res.data);   // 🔥 updates App instantly

            setIsEditing(false);
            toast.success("Profile updated successfully!");

        } catch (error) {
            console.error(error);
            toast.error("Update failed!");
        }
    };

    const handlePasswordChange = async () => {
        try {
            if (currentPassword !== storedUser.password) {
                toast.error("Current password is incorrect!");
                return;
            }

            if (newPassword !== confirmPassword) {
                toast.error("Passwords do not match!");
                return;
            }

            if (newPassword.length < 6) {
                toast.error("Password must be at least 6 characters!");
                return;
            }

            const res = await axios.patch(
                `http://localhost:5000/users/${storedUser.id}`,
                { password: newPassword }
            );

            localStorage.setItem("user", JSON.stringify(res.data));

            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");

            toast.success("Password updated successfully!");

        } catch (error) {
            console.error(error);
            toast.error("Password update failed!");
        }
    };

    const checkPasswordStrength = (password) => {
        if (!password) return "";

        let strength = 0;

        if (password.length >= 6) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 1) return "weak";
        if (strength === 2 || strength === 3) return "medium";
        return "strong";
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = async () => {
            try {
                const updatedUser = {
                    ...storedUser,
                    avatar: reader.result
                };

                const res = await API.put(
                    `/users/${storedUser.id}`,
                    updatedUser
                );

                localStorage.setItem("user", JSON.stringify(res.data));
                setAvatarPreview(res.data.avatar);

                toast.success("Avatar updated!");
            } catch (error) {
                console.error(error);
                toast.error("Image upload failed!");
            }
        };

        reader.readAsDataURL(file);
    };

    const isPasswordValid =
        passwordChecks.length &&
        passwordChecks.uppercase &&
        passwordChecks.number &&
        passwordChecks.special &&
        newPassword === confirmPassword;

    const passwordsMatch =
        confirmPassword.length > 0 && newPassword === confirmPassword;

    return (
        <>
            <div className={`profile-page ${darkMode ? "profile-dark" : ""}`}>
                <button
                    className="back-btn"
                    onClick={() => navigate("/")}
                >
                    ← Back
                </button>

                <h2>Profile Settings</h2>

                <div className="profile-card">

                    <div className="avatar-section">
                        <div className="avatar-large">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="avatar" />
                            ) : (
                                storedUser?.name?.charAt(0).toUpperCase()
                            )}
                        </div>

                        <label className="avatar-upload-btn">
                            Change Avatar
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                hidden
                            />
                        </label>
                    </div>

                    <p><strong>Email:</strong> {storedUser?.email}</p>

                    {/* ===== NAME EDIT SECTION ===== */}
                    <div className="profile-edit-row">
                        <strong>Name:</strong>

                        {isEditing ? (
                            <>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="profile-input"
                                />

                                <button className="save-btn" onClick={handleSave}>
                                    Save
                                </button>
                            </>
                        ) : (
                            <>
                                <span>{storedUser?.name}</span>

                                <button
                                    className="edit-btn"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            </>
                        )}
                    </div>

                    <hr />

                    {/* ===== PASSWORD SECTION ===== */}
                    <h3>Change Password</h3>

                    <div className="password-section">

                        <div className="password-wrapper">
                            <input
                                type={showCurrent ? "text" : "password"}
                                placeholder="Current Password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="profile-input"
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowCurrent(!showCurrent)}
                            >
                                {showCurrent ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>

                        <div className="password-wrapper">
                            <input
                                type={showNew ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNewPassword(value);

                                    setPasswordChecks({
                                        length: value.length >= 6,
                                        uppercase: /[A-Z]/.test(value),
                                        number: /[0-9]/.test(value),
                                        special: /[^A-Za-z0-9]/.test(value)
                                    });
                                }}
                                className="profile-input"
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowNew(!showNew)}
                            >
                                {showNew ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {newPassword && (
                            <div className="password-checklist">
                                <p className={passwordChecks.length ? "valid" : "invalid"}>
                                    {passwordChecks.length ? "✔" : "✖"} At least 6 characters
                                </p>

                                <p className={passwordChecks.uppercase ? "valid" : "invalid"}>
                                    {passwordChecks.uppercase ? "✔" : "✖"} One uppercase letter
                                </p>

                                <p className={passwordChecks.number ? "valid" : "invalid"}>
                                    {passwordChecks.number ? "✔" : "✖"} One number
                                </p>

                                <p className={passwordChecks.special ? "valid" : "invalid"}>
                                    {passwordChecks.special ? "✔" : "✖"} One special character
                                </p>
                            </div>
                        )}

                        <div className="password-wrapper">
                            <input
                                type={showConfirm ? "text" : "password"}
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="profile-input"
                            />
                            <span
                                className="password-toggle"
                                onClick={() => setShowConfirm(!showConfirm)}
                            >
                                {showConfirm ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                        {confirmPassword && (
                            <div className={`password-match ${passwordsMatch ? "match" : "no-match"}`}>
                                {passwordsMatch ? "✔ Passwords match" : "✖ Passwords do not match"}
                            </div>
                        )}

                        <button
                            className="save-btn"
                            onClick={handlePasswordChange}
                            disabled={!isPasswordValid}
                        >
                            Update Password
                        </button>

                    </div>

                </div>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                theme={darkMode ? "dark" : "light"}
            />
        </>
    );
};

export default Profile;