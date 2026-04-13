import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaUser,
  FaDumbbell,
  FaSignOutAlt,
  FaFire,
} from "react-icons/fa";
import { useState, useEffect } from "react";

function UserSidebar() {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    navigate("/");
  };
  useEffect(() => {
    const name = localStorage.getItem("name");
    setUserName(name);
  }, []);

  const menu = [
    { name: "Dashboard", path: "/user", icon: <FaHome /> },
    { name: "Profile", path: "/user/profile", icon: <FaUser /> },
    { name: "Workouts", path: "/user/workouts", icon: <FaDumbbell /> },
  ];

  return (
    <div className="user-sidebar">
      {/* App Logo */}
      <div className="sidebar-top">
        <h2> FitTrack</h2>
        <p>Your Fitness Partner</p>
      </div>

      {/* User Card */}
      <div className="sidebar-user-card">
        <div className="avatar">
          {userName ? userName.charAt(0).toUpperCase() : "U"}
        </div>
        <div>
          <h4>{userName || "User"}</h4>
          <span>Gold Member</span>
        </div>
      </div>

      {/* Menu */}
      <ul className="sidebar-menu">
        {menu.map((item, index) => (
          <li key={index}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? "active" : ""}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Motivation Box */}
      <div className="sidebar-motivation">
        <FaFire />
        <p>Keep pushing your limits </p>
      </div>

      {/* Logout */}
      <button onClick={handleLogout} className="sidebar-logout">
        <FaSignOutAlt /> Logout
      </button>
    </div>
  );
}

export default UserSidebar;
