import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [message, setMessage] = useState("");
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

 const handleLogin = async () => {
  const res = await axios.post('http://localhost:5000/login', {
    email,
    password
  });

  if (res.data.message) {
    setMessage(res.data.message);
    return;
  }

  localStorage.setItem('token', res.data.token);
  localStorage.setItem("role", res.data.role);
  localStorage.setItem("name", res.data.name);
  localStorage.setItem('email', res.data.email);

  if (res.data.role === 'admin') navigate('/admin');
  else navigate('/user');
};

  return (
  <div className="auth-page">
    <div className='container'>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Password" type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p className="error-msg">{message}</p>
      <p onClick={() => navigate('/register')}>New User? Register</p>
    </div>
  </div>
);;
}

export default Login;
