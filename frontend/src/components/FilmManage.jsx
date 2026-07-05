import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FilmManage = () => {
  const [films, setFilms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    judul: '', genre: '', durasi: '', harga: '', sinopsis: '', rate_usia: ''
  });

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchFilms = async () => {
    try {
      const res = await axios.get('/api/films');
      setFilms(res.data);
      setLoading(false);
    } catch (err) {
      setError('Gagal memuat data film');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ judul: '', genre: '', durasi: '', harga: '', sinopsis: '', rate_usia: '' });
    setIsEditing(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.judul || !form.harga) {
      setError('Judul dan harga wajib diisi');
      return;
    }
    try {
      if (isEditing && editingId) {
        await axios.put(`/api/films/${editingId}`, form, config);
        alert('Film berhasil diupdate!');
      } else {
        await axios.post('/api/films', form, config);
        alert('Film berhasil ditambahkan!');
      }
      resetForm();
      fetchFilms();
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal menyimpan data');
    }
  };

  const handleEdit = (film) => {
    setForm({
      judul: film.judul,
      genre: film.genre || '',
      durasi: film.durasi || '',
      harga: film.harga,
      sinopsis: film.sinopsis || '',
      rate_usia: film.rate_usia || ''
    });
    setIsEditing(true);
    setEditingId(film.id_film);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin ingin menghapus film ini?')) return;
    try {
      await axios.delete(`/api/films/${id}`, config);
      alert('Film berhasil dihapus!');
      fetchFilms();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menghapus film');
    }
  };

  if (loading) return <div className="loading-neo">Memuat data film...</div>;

  return (
    <div>
      <h3 className="fw-bold"><i className='bx bx-film'></i> Manajemen Film</h3>
      {error && <div className="error-neo my-3">{error}</div>}

      <div className="neobrutalism-card">
        <h5>{isEditing ? 'Edit Film' : 'Tambah Film Baru'}</h5>
        <form onSubmit={handleSubmit} className="form-neo">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Judul <span className="text-danger">*</span></label>
              <input type="text" name="judul" className="form-control" value={form.judul} onChange={handleChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Genre</label>
              <input type="text" name="genre" className="form-control" value={form.genre} onChange={handleChange} />
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Durasi (menit)</label>
              <input type="number" name="durasi" className="form-control" value={form.durasi} onChange={handleChange} />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Harga <span className="text-danger">*</span></label>
              <input type="number" name="harga" className="form-control" value={form.harga} onChange={handleChange} required />
            </div>
            <div className="col-md-4 mb-3">
              <label className="form-label fw-bold">Rate Usia</label>
              <input type="number" name="rate_usia" className="form-control" value={form.rate_usia} onChange={handleChange} />
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label fw-bold">Sinopsis</label>
            <textarea name="sinopsis" className="form-control" rows="2" value={form.sinopsis} onChange={handleChange} />
          </div>
          <div className="d-flex gap-2">
            <button type="submit" className="btn btn-neo">
              {isEditing ? <i className='bx bx-edit'></i> : <i className='bx bx-plus'></i>} {isEditing ? 'Update' : 'Tambah'}
            </button>
            {isEditing && (
              <button type="button" className="btn btn-neo-secondary btn-neo" onClick={resetForm}>
                <i className='bx bx-x'></i> Batal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="mt-4">
        <h5>Daftar Film</h5>
        <div className="table-responsive">
          <table className="table table-neo table-striped">
            <thead>
              <tr>
                <th>ID</th><th>Judul</th><th>Genre</th><th>Durasi</th><th>Harga</th><th>Usia</th><th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {films.map(film => (
                <tr key={film.id_film}>
                  <td>{film.id_film}</td>
                  <td>{film.judul}</td>
                  <td>{film.genre || '-'}</td>
                  <td>{film.durasi ? film.durasi+' mnt' : '-'}</td>
                  <td>Rp{film.harga.toLocaleString()}</td>
                  <td>{film.rate_usia || 'Semua'}</td>
                  <td>
                    <button className="btn btn-neo-secondary btn-neo btn-sm me-1" onClick={() => handleEdit(film)}>
                      <i className='bx bx-edit'></i>
                    </button>
                    <button className="btn btn-neo-danger btn-neo btn-sm" onClick={() => handleDelete(film.id_film)}>
                      <i className='bx bx-trash'></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FilmManage;