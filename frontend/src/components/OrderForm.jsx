import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ROWS = 5;
const COLS = 5;

const OrderForm = () => {
  const { jadwalId } = useParams();
  const navigate = useNavigate();
  const [jadwal, setJadwal] = useState(null);
  const [film, setFilm] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [form, setForm] = useState({ nama: '', no_telepon: '', usia: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingData, setLoadingData] = useState(true);

  // State untuk modal usia
  const [showAgeModal, setShowAgeModal] = useState(false);
  const [ageError, setAgeError] = useState({
    message: '',
    rate_usia: 0,
    usia_pembeli: 0,
    judul: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const jadwalRes = await axios.get('/api/jadwal', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const jadwalData = jadwalRes.data.find(j => j.id_jadwal === parseInt(jadwalId));
        if (!jadwalData) {
          setError('Jadwal tidak ditemukan');
          setLoadingData(false);
          return;
        }
        setJadwal(jadwalData);
        
        const filmRes = await axios.get(`/api/films/${jadwalData.id_film}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFilm(filmRes.data);
        
        const bookedRes = await axios.get(`/api/tiket/booked/${jadwalId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookedSeats(bookedRes.data || []);
        setLoadingData(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Gagal memuat data');
        setLoadingData(false);
      }
    };
    fetchData();
  }, [jadwalId]);

  const handleSeatClick = (seatNum) => {
    if (bookedSeats.includes(seatNum)) return;
    setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
  };

  // Fungsi untuk memeriksa usia sebelum submit
  const validateAge = () => {
    // Jika film tidak memiliki batasan usia (rate_usia = 0)
    if (!film.rate_usia || film.rate_usia === 0) {
      return true; // Boleh ditonton semua usia
    }

    // Jika usia tidak diisi
    if (!form.usia || form.usia === '') {
      setAgeError({
        message: `Film "${film.judul}" hanya untuk usia ${film.rate_usia} tahun ke atas.`,
        rate_usia: film.rate_usia,
        usia_pembeli: 0,
        judul: film.judul
      });
      setShowAgeModal(true);
      return false;
    }

    const usiaNum = parseInt(form.usia);
    if (usiaNum < film.rate_usia) {
      setAgeError({
        message: `Maaf, film "${film.judul}" hanya untuk usia ${film.rate_usia} tahun ke atas.`,
        rate_usia: film.rate_usia,
        usia_pembeli: usiaNum,
        judul: film.judul
      });
      setShowAgeModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSeat) {
      setError('Silakan pilih kursi terlebih dahulu');
      return;
    }
    if (!form.nama.trim()) {
      setError('Nama pembeli wajib diisi');
      return;
    }

    // Validasi usia sebelum submit
    if (!validateAge()) {
      return; // Modal akan muncul
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      const payload = {
        id_jadwal: parseInt(jadwalId),
        nama: form.nama.trim(),
        no_telepon: form.no_telepon || null,
        usia: form.usia ? parseInt(form.usia) : null,
        nomor_kursi: selectedSeat
      };

      const res = await axios.post('/api/pemesanan', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      navigate(`/confirmation/${res.data.id_pemesanan}`);
    } catch (err) {
      // Jika error dari backend karena usia
      if (err.response?.data?.rate_usia) {
        setAgeError({
          message: err.response.data.error,
          rate_usia: err.response.data.rate_usia,
          usia_pembeli: err.response.data.usia_pembeli || 0,
          judul: film?.judul || ''
        });
        setShowAgeModal(true);
      } else {
        setError(err.response?.data?.error || 'Gagal memesan tiket');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderSeats = () => {
    const seats = [];
    for (let i = 1; i <= ROWS * COLS; i++) {
      const isBooked = bookedSeats.includes(i);
      const isSelected = selectedSeat === i;
      seats.push(
        <div
          key={i}
          className={`seat-neo ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
          onClick={() => handleSeatClick(i)}
          style={{ cursor: isBooked ? 'not-allowed' : 'pointer' }}
        >
          {i}
        </div>
      );
    }
    return seats;
  };

  // Tampilkan rate usia dengan format yang lebih baik
  const getAgeLabel = (rate) => {
    if (!rate || rate === 0) return 'Semua Usia';
    return `${rate}+ Tahun`;
  };

  if (loadingData) return <div className="loading-neo">Memuat data kursi...</div>;
  if (error) return (
    <div className="neobrutalism-card">
      <div className="error-neo">{error}</div>
      <Link to="/dashboard/booking" className="btn btn-neo mt-3">Kembali</Link>
    </div>
  );
  if (!jadwal || !film) return <div className="neobrutalism-card">Data tidak lengkap</div>;

  return (
    <div>
      {/* Modal Peringatan Usia */}
      {showAgeModal && (
        <div className="modal-overlay" onClick={() => setShowAgeModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-icon">⚠️</div>
            <h4 className="fw-bold">Batasan Usia</h4>
            <div className="modal-body">
              <p>{ageError.message}</p>
              <div className="age-details">
                <div className="age-detail-item">
                  <span className="label">Film:</span>
                  <span className="value">{ageError.judul}</span>
                </div>
                <div className="age-detail-item">
                  <span className="label">Usia Minimal:</span>
                  <span className="value age-required">{ageError.rate_usia}+ Tahun</span>
                </div>
                {ageError.usia_pembeli > 0 && (
                  <div className="age-detail-item">
                    <span className="label">Usia Anda:</span>
                    <span className="value age-user">{ageError.usia_pembeli} Tahun</span>
                  </div>
                )}
                {ageError.usia_pembeli === 0 && (
                  <div className="age-detail-item">
                    <span className="label">Usia Anda:</span>
                    <span className="value age-user text-danger">Belum diisi</span>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-neo" onClick={() => setShowAgeModal(false)}>
                <i className='bx bx-check'></i> Saya Mengerti
              </button>
              {ageError.usia_pembeli > 0 && ageError.usia_pembeli < ageError.rate_usia && (
                <button 
                  className="btn btn-neo-secondary btn-neo" 
                  onClick={() => {
                    setShowAgeModal(false);
                    // Fokus ke input usia
                    document.getElementById('usia-input')?.focus();
                  }}
                >
                  <i className='bx bx-edit'></i> Ubah Usia
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="d-flex align-items-center gap-3 mb-3">
        <Link to={`/dashboard/booking/film/${film.id_film}`} className="btn btn-neo-secondary btn-neo">
          <i className='bx bx-arrow-back'></i> Kembali
        </Link>
        <h3 className="fw-bold m-0"><i className='bx bx-ticket'></i> Booking Tiket</h3>
      </div>

      <div className="neobrutalism-card">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="fw-bold">{film.judul}</h5>
          <span className="badge" style={{
            background: film.rate_usia > 0 ? '#ff6b6b' : '#51cf66',
            color: '#000',
            border: '2px solid #000',
            padding: '5px 12px',
            fontWeight: '700'
          }}>
            {getAgeLabel(film.rate_usia)}
          </span>
        </div>
        <div className="row mt-3">
          <div className="col-md-6">
            <p><i className='bx bx-calendar'></i> {new Date(jadwal.tanggal).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            <p><i className='bx bx-time'></i> {jadwal.jam.slice(0,5)} WIB</p>
            <p><i className='bx bx-money'></i> Rp{parseFloat(film.harga).toLocaleString()}</p>
            <p><i className='bx bx-chair'></i> Tersedia: {ROWS * COLS - bookedSeats.length} kursi</p>
            {film.rate_usia > 0 && (
              <p className="text-danger fw-bold">
                <i className='bx bx-info-circle'></i> Minimal usia: {film.rate_usia}+ tahun
              </p>
            )}
          </div>
          <div className="col-md-6">
            <div className="seat-grid-neo">
              {renderSeats()}
            </div>
            <div className="d-flex justify-content-center gap-4 mt-3">
              <span><span className="seat-neo" style={{width:'20px',height:'20px',display:'inline-block'}}></span> Tersedia</span>
              <span><span className="seat-neo booked" style={{width:'20px',height:'20px',display:'inline-block'}}></span> Terpesan</span>
              <span><span className="seat-neo selected" style={{width:'20px',height:'20px',display:'inline-block'}}></span> Dipilih</span>
            </div>
            {selectedSeat && <div className="mt-2 fw-bold text-success">Kursi terpilih: {selectedSeat}</div>}
          </div>
        </div>
      </div>

      <div className="neobrutalism-card">
        <h5 className="fw-bold">Data Pembeli</h5>
        <form onSubmit={handleSubmit} className="form-neo">
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Nama <span className="text-danger">*</span>
              </label>
              <input 
                type="text" 
                className="form-control" 
                value={form.nama} 
                onChange={e => setForm({...form, nama: e.target.value})} 
                required 
                placeholder="Masukkan nama pembeli"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">No. Telepon</label>
              <input 
                type="text" 
                className="form-control" 
                value={form.no_telepon} 
                onChange={e => setForm({...form, no_telepon: e.target.value})} 
                placeholder="Contoh: 08123456789"
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">
                Usia 
                {film.rate_usia > 0 && (
                  <span className="text-danger ms-1">* (Minimal {film.rate_usia} tahun)</span>
                )}
              </label>
              <input 
                id="usia-input"
                type="number" 
                className="form-control" 
                value={form.usia} 
                onChange={e => setForm({...form, usia: e.target.value})} 
                placeholder="Masukkan usia"
                min="0"
                required={film.rate_usia > 0}
                style={{
                  borderColor: film.rate_usia > 0 && form.usia && parseInt(form.usia) < film.rate_usia ? '#ff6b6b' : ''
                }}
              />
              {film.rate_usia > 0 && form.usia && parseInt(form.usia) < film.rate_usia && (
                <small className="text-danger fw-bold">
                  <i className='bx bx-error'></i> Usia minimal {film.rate_usia} tahun
                </small>
              )}
            </div>
          </div>
          <button type="submit" className="btn btn-neo-success btn-neo" disabled={loading}>
            {loading ? 'Memproses...' : <><i className='bx bx-check'></i> Pesan Tiket</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;