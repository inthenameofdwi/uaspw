import React, { useState, useEffect } from 'react';
import axios from 'axios';

const JadwalManage = () => {
  const [films, setFilms] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [form, setForm] = useState({ id_film: '', tanggal: '', jam: '' });
  const [editing, setEditing] = useState(null);

  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchFilms = () => {
    axios.get('/api/films').then(res => setFilms(res.data));
  };
  const fetchJadwal = () => {
    axios.get('/api/jadwal').then(res => setJadwal(res.data));
  };

  useEffect(() => {
    fetchFilms();
    fetchJadwal();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`/api/admin/jadwal/${editing}`, { tanggal: form.tanggal, jam: form.jam }, config);
      setEditing(null);
    } else {
      await axios.post('/api/admin/jadwal', form, config);
    }
    setForm({ id_film: '', tanggal: '', jam: '' });
    fetchJadwal();
  };

  const handleEdit = (j) => {
    setEditing(j.id_jadwal);
    setForm({ id_film: j.id_film, tanggal: j.tanggal, jam: j.jam });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Hapus jadwal ini?')) {
      await axios.delete(`/api/admin/jadwal/${id}`, config);
      fetchJadwal();
    }
  };

  return (
    <div>
      <h3>Atur Jadwal Tayang</h3>
      <form onSubmit={handleSubmit}>
        <select value={form.id_film} onChange={e => setForm({...form, id_film: e.target.value})} required>
          <option value="">Pilih Film</option>
          {films.map(f => <option key={f.id_film} value={f.id_film}>{f.judul}</option>)}
        </select>
        <input type="date" value={form.tanggal} onChange={e => setForm({...form, tanggal: e.target.value})} required />
        <input type="time" value={form.jam} onChange={e => setForm({...form, jam: e.target.value})} required />
        <button type="submit">{editing ? 'Update' : 'Tambah'}</button>
        {editing && <button onClick={() => {setEditing(null); setForm({id_film:'', tanggal:'', jam:''});}}>Batal</button>}
      </form>
      <table>
        <thead><tr><th>Film</th><th>Tanggal</th><th>Jam</th><th>Aksi</th></tr></thead>
        <tbody>
          {jadwal.map(j => (
            <tr key={j.id_jadwal}>
              <td>{j.judul}</td>
              <td>{j.tanggal}</td>
              <td>{j.jam}</td>
              <td>
                <button onClick={() => handleEdit(j)}>Edit</button>
                <button onClick={() => handleDelete(j.id_jadwal)}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JadwalManage;