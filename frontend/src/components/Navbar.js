import {  FaSearch, FaDumbbell } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";

function Navbar() {
  

  return (
    <div className="navbar">
      <div className="nav-left">
        <FaDumbbell className="logo-icon"/>
        <h3>Smart Gym </h3>
      </div>
      <div className="nav-search">
        <FaSearch className="search-icon"/>
        <input type="text" placeholder="Search members, trainers..." />
      </div>
      

    </div>
  );
}

export default Navbar;