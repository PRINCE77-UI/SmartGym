import { useEffect, useState } from "react";
import axios from "axios";
import { FaDumbbell, FaFire, FaClock, FaArrowRight } from "react-icons/fa";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [showPlan, setShowPlan] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/user", {
          headers: {
            Authorization: token,
          },
        });

        setUser(res.data);
        setUserName(res.data.name);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="user-dashboard">
      {/* Welcome Section */}
      <div className="dashboard-header">
        <h2>Welcome Back, {userName} </h2>
        <p>Stay consistent. Your goal is closer than you think.</p>
      </div>

      {/* Cards */}
      <div className="dashboard-cards">
        <div className="dashboard-card blue">
          <FaDumbbell className="card-icon" />
          <div>
            <h3>Today's Workout</h3>
            <p>Chest & Triceps</p>
          </div>
        </div>

        <div className="dashboard-card red">
          <FaFire className="card-icon" />
          <div>
            <h3>Calories Burned</h3>
            <p>520 kcal</p>
          </div>
        </div>

        <div className="dashboard-card green">
          <FaClock className="card-icon" />
          <div>
            <h3>Workout Time</h3>
            <p>1 hr 10 min</p>
          </div>
        </div>
      </div>

      {/* Plan Section */}
      <div className="plan-section">
        <div>
          <h3>Your Plan</h3>
          <p>Weight Loss Program</p>
        </div>

        <button className="plan-btn" onClick={() => setShowPlan(true)}>
          View Full Plan <FaArrowRight />
        </button>
      </div>

      {/* Motivation */}
      <div className="motivation-box">
        “The pain you feel today will be the strength you feel tomorrow.”
      </div>
      {showPlan && (
        <div className="modal">
          <div className="modal-content">
            <h2>Your Fitness Plan</h2>

            <p>
              <strong>Plan:</strong> {user?.plan}
            </p>

            <p>
              <strong>Workout Split:</strong>
            </p>
            <ul>
              <li>Day 1: Chest & Triceps</li>
              <li>Day 2: Back & Biceps</li>
              <li>Day 3: Legs</li>
              <li>Day 4: Shoulders</li>
              <li>Day 5: Cardio</li>
            </ul>

            <p>
              <strong>Diet Tip:</strong> High protein, low sugar
            </p>

            <button onClick={() => setShowPlan(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
