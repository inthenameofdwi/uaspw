import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = ({ setAuth }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('username', res.data.username);
      setAuth(true);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal');
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="neobrutalism-card">
          <h3 className="fw-bold mb-3"><i className='bx bx-lock-alt'></i> Login Admin</h3>
          {error && <div className="error-neo mb-3">{error}</div>}
          <form onSubmit={handleSubmit} className="form-neo">
            <div className="mb-3">
              <label className="form-label fw-bold">Username</label>
              <input
                type="text"
                className="form-control"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                placeholder="Masukkan username"
              />
            </div>
            <div className="mb-3">
              <label className="form-label fw-bold">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="Masukkan password"
              />
            </div>
            <button type="submit" className="btn btn-neo w-100">
              <i className='bx bx-log-in'></i> Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;