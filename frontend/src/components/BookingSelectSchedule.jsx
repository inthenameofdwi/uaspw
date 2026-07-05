import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const BookingSelectSchedule = () => {
  const { filmId } = useParams();
  const [film, setFilm] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const [filmRes, jadwalRes] = await Promise.all([
          axios.get(`/api/films/${filmId}`),
          axios.get(`/api/jadwal?film_id=${filmId}`)
        ]);
        setFilm(filmRes.data);
        // Filter jadwal yang tanggalnya >= hari ini
        const today = new Date().toISOString().split('T')[0];
        const upcoming = jadwalRes.data.filter(j => j.tanggal >= today);
        setJadwal(upcoming);
        setLoading(false);
      } catch (err) {
        setError('Gagal memuat data');
        setLoading(false);
        console.error(err);
      }
    };
    fetchData();
  }, [filmId]);

  if (loading) return <div className="loading">Memuat jadwal...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!film) return <div>Film tidak ditemukan</div>;

  return (
    <div>
      <h3>Jadwal Tayang: {film.judul}</h3>
      <Link to="/dashboard/booking" className="btn btn-small">← Kembali ke Pilih Film</Link>
      
      {jadwal.length === 0 ? (
        <p>Belum ada jadwal tayang untuk film ini.</p>
      ) : (
        <div className="jadwal-container">
          {jadwal.map(j => (
            <div className="jadwal-card" key={j.id_jadwal}>
              <div className="jadwal-info">
                <p><strong>Tanggal:</strong> {new Date(j.tanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                <p><strong>Jam:</strong> {j.jam.slice(0,5)} WIB</p>
              </div>
              <Link to={`/dashboard/booking/seat/${j.id_jadwal}`} className="btn">
                Pilih Kursi
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingSelectSchedule;