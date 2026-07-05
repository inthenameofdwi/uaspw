import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const BookingSelectFilm = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/films/with-schedule', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
      setFilms(res.data);
      setLoading(false);
    })
    .catch(err => {
      setError('Gagal memuat data film');
      setLoading(false);
      console.error(err);
    });
  }, []);

  if (loading) return <div className="loading">Memuat daftar film...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <h3>Pilih Film untuk Booking Tiket</h3>
      {films.length === 0 ? (
        <p>Belum ada film yang memiliki jadwal tayang.</p>
      ) : (
        <div className="film-grid">
          {films.map(film => (
            <div className="film-card" key={film.id_film}>
              <h3>{film.judul}</h3>
              <p><strong>Genre:</strong> {film.genre}</p>
              <p><strong>Durasi:</strong> {film.durasi} menit</p>
              <p><strong>Harga:</strong> Rp{film.harga.toLocaleString()}</p>
              <Link to={`/dashboard/booking/film/${film.id_film}`} className="btn">
                Pilih Jadwal
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingSelectFilm;