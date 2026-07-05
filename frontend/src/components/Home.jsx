import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/films')
      .then(res => {
        setFilms(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getAgeBadge = (rate) => {
    if (!rate || rate === 0) {
      return <span className="film-age-badge all">✅ Semua Usia</span>;
    }
    return <span className="film-age-badge restricted">🔞 {rate}+ Tahun</span>;
  };

  if (loading) return <div className="loading-neo">Memuat film...</div>;

  return (
    <div>
      <h2 className="mb-4 fw-bold">🎬 Film Tayang</h2>
      <div className="film-grid">
        {films.map(film => (
          <div className="neobrutalism-card" key={film.id_film}>
            <div className="d-flex justify-content-between align-items-start">
              <h4 className="fw-bold">{film.judul}</h4>
              {getAgeBadge(film.rate_usia)}
            </div>
            <p><i className='bx bx-tag'></i> {film.genre || '-'}</p>
            <p><i className='bx bx-time'></i> {film.durasi} menit</p>
            <p><i className='bx bx-money'></i> Rp{film.harga.toLocaleString()}</p>
            <Link to={`/film/${film.id_film}`} className="btn btn-neo w-100">
              <i className='bx bx-calendar'></i> Lihat Jadwal
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;