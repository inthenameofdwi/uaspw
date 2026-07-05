import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const FilmDetail = () => {
  const { id } = useParams();
  const [film, setFilm] = useState(null);
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const filmRes = await axios.get(`/api/films/${id}`);
        setFilm(filmRes.data);
        const jadwalRes = await axios.get(`/api/jadwal?film_id=${id}`);
        setJadwal(jadwalRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Memuat...</div>;
  if (!film) return <div>Film tidak ditemukan</div>;

  return (
    <div>
      <h2>{film.judul}</h2>
      <p><strong>Genre:</strong> {film.genre}</p>
      <p><strong>Durasi:</strong> {film.durasi} menit</p>
      <p><strong>Harga:</strong> Rp{film.harga.toLocaleString()}</p>
      <p><strong>Sinopsis:</strong> {film.sinopsis || 'Tidak ada sinopsis'}</p>
      <p><strong>Usia minimal:</strong> {film.rate_usia}+</p>

      <h3>Jadwal Tayang</h3>
      {jadwal.length === 0 ? (
        <p>Belum ada jadwal.</p>
      ) : (
        <ul className="jadwal-list">
          {jadwal.map(j => (
            <li key={j.id_jadwal}>
              Tanggal: {new Date(j.tanggal).toLocaleDateString('id-ID')} - Jam: {j.jam.slice(0,5)}
              <Link to={`/order/${j.id_jadwal}`} className="btn btn-small">Pesan Tiket</Link>
            </li>
          ))}
        </ul>
      )}
<div className="d-flex align-items-center gap-2 mt-2">
  <strong>Usia Minimal:</strong>
  <span className={`film-age-badge ${film.rate_usia === 0 ? 'all' : 'restricted'}`}>
    {film.rate_usia === 0 ? '✅ Semua Usia' : `🔞 ${film.rate_usia}+ Tahun`}
  </span>
</div>
    </div>
  );
};

export default FilmDetail;