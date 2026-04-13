import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaUserTie,
  FaDumbbell,
  FaMoneyBill,
} from "react-icons/fa";
//  import { useState, useEffect } from "react";

function Sidebar() {
  //    const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  //    useEffect(() => {
  //      const auth = localStorage.getItem("isAdminLoggedIn");
  //      if (auth) {
  //        setLoggedIn(true);
  //      }
  //    }, []);

  //    const handleLogin = () => {
  //      navigate("/login");
  //    };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/");
  };

  // const handleWorkoutClick = (e) => {

  //   if (!loggedIn) {
  //     e.preventDefault();
  //     alert("Please login first to access Workouts");
  //     navigate("/login");
  //   }

  // };

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>FitTrack Pro</h2>
      </div>

      <nav className="menu">
        <Link to="/admin" className="menu-item">
          <FaHome className="icon" />
          <span>Dashboard</span>
        </Link>

        <Link to="/admin/members" className="menu-item">
          <FaUsers className="icon" />
          <span>Members</span>
        </Link>

        <Link to="/admin/trainers" className="menu-item">
          <FaUserTie className="icon" />
          <span>Trainers</span>
        </Link>

        <Link
          to="/admin/workouts"
          className="menu-item"
          // onClick={handleWorkoutClick}
        >
          <FaDumbbell className="icon" />
          <span>Workouts</span>
        </Link>

        <Link to="/admin/payments" className="menu-item">
          <FaMoneyBill className="icon" />
          <span>Payments</span>
        </Link>
      </nav>

      <div className="auth-section">
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
