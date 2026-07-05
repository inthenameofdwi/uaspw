import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ auth, setAuth }) => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setAuth(false);
    navigate('/');
  };
  return (
    <nav className="navbar navbar-expand-lg navbar-neo">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className='bx bx-movie'></i> Bioskop App
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/"><i className='bx bx-home'></i> Home</Link>
            </li>
            {auth ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard"><i className='bx bx-grid-alt'></i> Dashboard</Link>
                </li>
                <li className="nav-item">
                  <button className="btn-logout-neo" onClick={handleLogout}>
                    <i className='bx bx-log-out'></i> Logout
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link className="nav-link" to="/login"><i className='bx bx-lock-open'></i> Login</Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;