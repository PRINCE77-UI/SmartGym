import { FaDumbbell, FaClock, FaFire } from "react-icons/fa";

function Workouts() {
  return (
    <div className="user-workouts">

      <h1 className="workout-title">Today's Workout</h1>

      {/* Workout Plan */}
      <div className="workout-plan">
        <h2>Chest & Triceps </h2>
        <p>Focus on strength and muscle growth</p>
      </div>

      {/* Workout List */}
      <div className="workout-list">

        <div className="workout-card">
          <FaDumbbell className="workout-icon" />
          <div>
            <h3>Bench Press</h3>
            <p>4 sets × 10 reps</p>
          </div>
        </div>

        <div className="workout-card">
          <FaDumbbell className="workout-icon" />
          <div>
            <h3>Incline Dumbbell Press</h3>
            <p>3 sets × 12 reps</p>
          </div>
        </div>

        <div className="workout-card">
          <FaDumbbell className="workout-icon" />
          <div>
            <h3>Tricep Dips</h3>
            <p>3 sets × 15 reps</p>
          </div>
        </div>

        <div className="workout-card">
          <FaDumbbell className="workout-icon" />
          <div>
            <h3>Push Ups</h3>
            <p>3 sets × 20 reps</p>
          </div>
        </div>

      </div>

      {/* Summary Section */}
      <div className="workout-summary">
        <div className="summary-box">
          <FaClock />
          <p>Duration: 1 hr</p>
        </div>

        <div className="summary-box">
          <FaFire />
          <p>Calories: 500 kcal</p>
        </div>
      </div>

    </div>
  );
}

export default Workouts;