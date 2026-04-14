import { useEffect, useState } from "react";
import apiClient from "../../api/client";
import { FaUser, FaEnvelope, FaDumbbell, FaFire } from "react-icons/fa";

function Profile() {
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await apiClient.get("/users/profile");

        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
      });
    }
  }, [user]);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleUpdate = async () => {
    try {
      const res = await apiClient.put("/users/profile", formData);

      const userData = res.data.data || res.data;
      setUser(userData); // UI update
      setShowForm(false);

      // localStorage update
      localStorage.setItem("name", userData.name);
      localStorage.setItem("email", userData.email);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="user-profile">
      {/* Top Section */}
      <div className="profile-header">
        <div className="profile-avatar">
          <FaUser />
        </div>
        <div>
          <h2>{user?.name || "Loading..."}</h2>
          <p>Active Member</p>
        </div>
      </div>

      {/* Info Section */}
      <div className="profile-info">
        <div className="info-box">
          <FaEnvelope />
          <span>{user?.email || "Loading..."}</span>
        </div>

        <div className="info-box">
          <FaDumbbell />
          <span>Workout Plan: Muscle Gain</span>
        </div>

        <div className="info-box">
          <FaFire />
          <span>Calories Goal: 2200 kcal/day</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="profile-stats">
        <div className="stat-card">
          <h3>Weight</h3>
          <p>70 kg</p>
        </div>

        <div className="stat-card">
          <h3>Height</h3>
          <p>5.8 ft</p>
        </div>

        <div className="stat-card">
          <h3>Age</h3>
          <p>20 yrs</p>
        </div>
      </div>

      {/* Button */}
      <button className="edit-btn" onClick={() => setShowForm(true)}>
        Edit Profile
      </button>
      {showForm && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Profile</h3>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />

            <div className="modal-buttons">
              <button onClick={handleUpdate}>Update</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
