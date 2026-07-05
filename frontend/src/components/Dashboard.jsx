import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/dashboard/stats', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setStats(res.data))
    .catch(err => console.error(err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold"> Dashboard Kasir</h2>
        <div>
          <span className="fw-bold me-3"><i className='bx bx-user-circle'></i> {localStorage.getItem('username')}</span>
          <button className="btn-logout-neo" onClick={handleLogout}>
            <i className='bx bx-log-out'></i> Logout
          </button>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon"><i className='bx bx-film'></i></div>
            <div className="stat-number">{stats.totalFilm || 0}</div>
            <div className="fw-bold">Total Film</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon"><i className='bx bx-file'></i></div>
            <div className="stat-number">{stats.totalPemesanan || 0}</div>
            <div className="fw-bold">Pemesanan</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon"><i className='bx bx-money'></i></div>
            <div className="stat-number">Rp{stats.totalPendapatan?.toLocaleString() || 0}</div>
            <div className="fw-bold">Pendapatan</div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="stat-card">
            <div className="stat-icon"><i className='bx bx-user'></i></div>
            <div className="stat-number">{stats.totalPembeli || 0}</div>
            <div className="fw-bold">Pembeli</div>
          </div>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3 mb-4">
        <Link to="/dashboard" className="btn btn-neo"><i className='bx bx-home'></i> Home</Link>
        <Link to="/dashboard/film" className="btn btn-neo-secondary btn-neo"><i className='bx bx-film'></i> Film</Link>
        <Link to="/dashboard/jadwal" className="btn btn-neo"><i className='bx bx-calendar'></i> Jadwal</Link>
        <Link to="/dashboard/pembeli" className="btn btn-neo-danger btn-neo"><i className='bx bx-user'></i> Pembeli</Link>
        <Link to="/dashboard/booking" className="btn btn-neo-success btn-neo"><i className='bx bx-ticket'></i> Booking</Link>
      </div>

      <div className="neobrutalism-card">
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;