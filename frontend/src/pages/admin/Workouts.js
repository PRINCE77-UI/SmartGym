import axios from "axios";
import { useEffect, useState } from "react";
import { FaDumbbell, FaPlus, FaEdit, FaTrash } from "react-icons/fa";

function Workouts() {
  const [search, setSearch] = useState("");
  const [workouts, setWorkouts] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    trainer: "",
    difficulty: "Beginner",
    duration: "",
  });

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    const res = await axios.get("http://localhost:5000/workouts");
    setWorkouts(res.data);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveWorkout = async () => {
    if (!formData.name || !formData.trainer) {
      alert("Fill all fields");
      return;
    }

    if (editIndex !== null) {
      const workout = workouts[editIndex];

      await axios.put(`http://localhost:5000/workouts/${workout._id}`, formData);
    } else {
      await axios.post("http://localhost:5000/workouts", formData);
    }

    fetchWorkouts();

    setFormData({
      name: "",
      trainer: "",
      difficulty: "Beginner",
      duration: "",
    });

    setShowForm(false);
    setEditIndex(null);
  };

  const handleEdit = (index) => {
    const workout = workouts[index];

    setFormData(workout);
    setEditIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    const workout = workouts[index];

    await axios.delete(`http://localhost:5000/workouts/${workout._id}`);
    fetchWorkouts();
  };

  const filteredWorkouts = workouts.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="workout-page">

      {/* Header */}
      <div className="workout-header">
        <h2>Workout Management</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FaPlus /> Add Workout
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search workout..."
        className="search-workout"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>Workout</th>
            <th>Trainer</th>
            <th>Difficulty</th>
            <th>Duration</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filteredWorkouts.map((w, i) => (
            <tr key={w._id}>
              <td><FaDumbbell /> {w.name}</td>
              <td>{w.trainer}</td>
              <td>{w.difficulty}</td>
              <td>{w.duration}</td>

              <td>
                <FaEdit className="edit-icon" onClick={() => handleEdit(i)} />
                <FaTrash className="delete-icon" onClick={() => handleDelete(i)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>{editIndex !== null ? "Edit Workout" : "Add Workout"}</h3>

            <input
              type="text"
              name="name"
              placeholder="Workout Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="trainer"
              placeholder="Trainer Name"
              value={formData.trainer}
              onChange={handleChange}
            />

            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>

            <input
              type="text"
              name="duration"
              placeholder="Duration"
              value={formData.duration}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={handleSaveWorkout}>
                {editIndex !== null ? "Update" : "Save"}
              </button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Workouts;