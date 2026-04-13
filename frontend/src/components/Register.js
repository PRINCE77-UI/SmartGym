import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
// import { FaArrowLeft } from "react-icons/fa";

function Register() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      setMessage("Please fill all fields");
      return;
    }

    const res = await axios.post("http://localhost:5000/register", {
      name,
      email,
      password,
      role,
    });

    setMessage(res.data.message);

    if (res.data.message === "Registered Successfully") {
      navigate("/");
    }
  };

  return (
    <div className="auth-page">
      <div className="container">
        <h2>Register</h2>

        <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <select onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button onClick={handleRegister}>Register</button>
        <button className="back-btn" onClick={() => navigate("/")}>
         Back to Login
        </button>
        <p className="error-msg">{message}</p>
      </div>
    </div>
  );
}

export default Register;
