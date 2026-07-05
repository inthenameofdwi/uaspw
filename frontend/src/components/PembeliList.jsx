import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PembeliList = () => {
  const [pembeli, setPembeli] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('/api/admin/pembeli', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setPembeli(res.data))
    .catch(err => console.error(err));
  }, []);
  return (
    <div>
      <h3>Daftar Pembeli</h3>
      <table>
        <thead>
          <tr><th>ID</th><th>Nama</th><th>Telepon</th><th>Usia</th></tr>
        </thead>
        <tbody>
          {pembeli.map(p => (
            <tr key={p.id_pembeli}>
              <td>{p.id_pembeli}</td>
              <td>{p.nama}</td>
              <td>{p.no_telepon || '-'}</td>
              <td>{p.usia || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PembeliList;