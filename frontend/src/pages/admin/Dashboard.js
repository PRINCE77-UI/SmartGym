import Card from "../../components/Card";
import { FaUsers, FaUserTie, FaMoneyBillWave, FaDumbbell } from "react-icons/fa";

function Dashboard() {
  return (
    <div className="dashboard">

      <div className="dashboard-header">
        <h2>FitTrack Pro Dashboard</h2>
        <p>Monitor your gym performance and activities</p>
      </div>

      <div className="grid">

        <Card
          title="Total Members"
          value="320"
          icon={<FaUsers />}
        />

        <Card
          title="Active Trainers"
          value="12"
          icon={<FaUserTie />}
        />

        <Card
          title="Monthly Revenue"
          value="₹85,000"
          icon={<FaMoneyBillWave />}
        />

        <Card
          title="Workout Plans"
          value="25"
          icon={<FaDumbbell />}
        />

      </div>

      <div className="dashboard-bottom">

        <div className="card activity">
          <h3>Recent Activity</h3>

          <ul>
            <li>Rahul joined Gold Membership</li>
            <li>Trainer Aman assigned workout plan</li>
            <li>Payment received from Neha</li>
            <li>New member registration completed</li>
          </ul>
        </div>

        <div className="card announcement">
          <h3>Announcements</h3>

          <ul>
            <li>New Yoga class starting Monday</li>
            <li>Gym closed on national holiday</li>
            <li>Discount on 6-month membership</li>
          </ul>
        </div>

      </div>

    </div>
  );
}

export default Dashboard;