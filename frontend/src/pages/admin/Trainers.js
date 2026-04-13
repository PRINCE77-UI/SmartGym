import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [status, setStatus] = useState("Active");

  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    const res = await axios.get("http://localhost:5000/trainers");
    setTrainers(res.data);
  };

  const saveTrainer = async () => {
    if (name === "" || specialization === "") {
      alert("Fill all fields");
      return;
    }

    if (editIndex !== null) {
      const trainer = trainers[editIndex];

      await axios.put(`http://localhost:5000/trainers/${trainer._id}`, {
        name,
        specialization,
        status
      });
    } else {
      await axios.post("http://localhost:5000/trainers", {
        name,
        specialization,
        status
      });
    }

    fetchTrainers();

    setName("");
    setSpecialization("");
    setStatus("Active");
    setShowForm(false);
    setEditIndex(null);
  };


  const editTrainer = (index) => {
    const trainer = trainers[index];

    setName(trainer.name);
    setSpecialization(trainer.specialization);
    setStatus(trainer.status);

    setEditIndex(index);
    setShowForm(true);
  };

  const deleteTrainer = async (index) => {
    const trainer = trainers[index];

    await axios.delete(`http://localhost:5000/trainers/${trainer._id}`);

    fetchTrainers();
  };


  const filteredTrainers = trainers.filter((trainer) =>
    trainer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="members-header">
        <h2>Trainer Management</h2>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
          }}
        >
          + Add Trainer
        </button>
      </div>

      <input
        type="text"
        placeholder="Search trainer..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showForm && (
        <div className="card">
          <h3>{editIndex !== null ? "Edit Trainer" : "Add Trainer"}</h3>

          <input
            type="text"
            placeholder="Trainer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Specialization"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <div className="form-buttons">
            <button onClick={saveTrainer}>
              {editIndex !== null ? "Update" : "Save"}
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Specialization</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredTrainers.map((trainer, index) => (
              <tr key={trainer._id}>
                <td>{trainer.name}</td>
                <td>{trainer.specialization}</td>

                <td>
                  <span
                    className={
                      trainer.status === "Active"
                        ? "status active"
                        : "status expired"
                    }
                  >
                    {trainer.status}
                  </span>
                </td>

                <td>
                  <FaEdit
                    className="edit-icon"
                    onClick={() => editTrainer(index)}
                  />

                  <FaTrash
                    className="delete-icon"
                    onClick={() => deleteTrainer(index)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Trainers;