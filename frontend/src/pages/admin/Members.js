import axios from "axios";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

function Members() {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("Active");
  const [editIndex, setEditIndex] = useState(null);

 
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const res = await axios.get("http://localhost:5000/members");
    setMembers(res.data);
  };

  const saveMember = async () => {
    if (name === "" || plan === "") {
      alert("Fill all fields");
      return;
    }

    if (editIndex !== null) {
      const member = members[editIndex];

      await axios.put(`http://localhost:5000/members/${member._id}`, {
        name,
        plan,
        status
      });
    } else {
      await axios.post("http://localhost:5000/members", {
        name,
        plan,
        status
      });
    }

    fetchMembers();

    setName("");
    setPlan("");
    setStatus("Active");
    setShowForm(false);
    setEditIndex(null);
  };

  const editMember = (index) => {
    const member = members[index];

    setName(member.name);
    setPlan(member.plan);
    setStatus(member.status);

    setEditIndex(index);
    setShowForm(true);
  };

  const deleteMember = async (index) => {
    const member = members[index];

    await axios.delete(`http://localhost:5000/members/${member._id}`);

    fetchMembers();
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="members-header">
        <h2>Members Management</h2>

        <button
          className="add-btn"
          onClick={() => {
            setShowForm(true);
            setEditIndex(null);
          }}
        >
          + Add Member
        </button>
      </div>

      <input
        type="text"
        placeholder="Search member..."
        className="search-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {showForm && (
        <div className="card">
          <h3>{editIndex !== null ? "Edit Member" : "Add Member"}</h3>

          <input
            type="text"
            placeholder="Member Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          />

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Active</option>
            <option>Expired</option>
          </select>

          <div className="form-buttons">
            <button onClick={saveMember}>
              {editIndex !== null ? "Update" : "Save"}
            </button>

            <button className="cancel-btn" onClick={() => setShowForm(false)}>
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
              <th>Plan</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member, index) => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.plan}</td>

                <td>
                  <span
                    className={
                      member.status === "Active"
                        ? "status active"
                        : "status expired"
                    }
                  >
                    {member.status}
                  </span>
                </td>

                <td>
                  <FaEdit
                    className="edit-icon"
                    onClick={() => editMember(index)}
                  />

                  <FaTrash
                    className="delete-icon"
                    onClick={() => deleteMember(index)}
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

export default Members;