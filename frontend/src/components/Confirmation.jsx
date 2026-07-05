import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Confirmation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) { setError('Silakan login'); setLoading(false); return; }
        axios.get(`/api/pemesanan/${id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => { setData(res.data); setLoading(false); })
            .catch(err => {
                setError(err.response?.data?.error || 'Data tidak ditemukan');
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div className="loading-neo">Memuat konfirmasi...</div>;
    if (error) return (
        <div className="neobrutalism-card text-center">
            <div className="error-neo">{error}</div>
            <Link to="/dashboard/booking" className="btn btn-neo mt-3">Kembali Booking</Link>
        </div>
    );
    if (!data) return <div className="neobrutalism-card">Data tidak ada</div>;

    return (
        <div className="row justify-content-center">
            <div className="col-lg-8">
                <div className="ticket-neo">
                    <div className="text-center mb-4">
                        <div className="display-1">✅</div>
                        <h2 className="fw-bold">Pemesanan Berhasil!</h2>
                        <p className="text-muted">Tiket Anda telah dipesan</p>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>ID Pemesanan:</strong> #{data.id_pemesanan}</p>
                            <p><strong>Film:</strong> {data.judul}</p>
                            <p><strong>Genre:</strong> {data.genre || '-'}</p>
                            <p><strong>Tanggal:</strong> {new Date(data.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p><strong>Jam:</strong> {data.jam.slice(0, 5)} WIB</p>
                            <p><strong>Batasan Usia:</strong>
                                {data.rate_usia === 0 ? '✅ Semua Usia' : `🔞 ${data.rate_usia}+ Tahun`}
                            </p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Kursi:</strong> <span className="badge bg-dark fs-6">{data.nomor_kursi}</span></p>
                            <p><strong>Pembeli:</strong> {data.nama}</p>
                            <p><strong>No. Telepon:</strong> {data.no_telepon || '-'}</p>
                            <p><strong>Usia:</strong> {data.usia || '-'}</p>
                            <p><strong>Total Harga:</strong> <span className="fw-bold text-success">Rp{parseFloat(data.total_harga).toLocaleString()}</span></p>
                        </div>
                    </div>
                    <div className="d-flex gap-2 justify-content-center mt-4">
                        <button className="btn btn-neo-secondary btn-neo" onClick={() => window.print()}><i className='bx bx-printer'></i> Cetak</button>
                        <Link to="/dashboard/booking" className="btn btn-neo-success btn-neo"><i className='bx bx-ticket'></i> Booking Lagi</Link>
                        <Link to="/dashboard" className="btn btn-neo-dark btn-neo"><i className='bx bx-grid-alt'></i> Dashboard</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmation;