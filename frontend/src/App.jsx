import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import FilmDetail from './components/FilmDetail';
import OrderForm from './components/OrderForm';
import Confirmation from './components/Confirmation';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import PembeliList from './components/PembeliList';
import JadwalManage from './components/JadwalManage';
import FilmManage from './components/FilmManage';
import BookingSelectFilm from './components/BookingSelectFilm';
import BookingSelectSchedule from './components/BookingSelectSchedule';

function App() {
  const [auth, setAuth] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Navbar auth={auth} setAuth={setAuth} />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/film/:id" element={<FilmDetail />} />
          <Route path="/order/:jadwalId" element={
            <PrivateRoute>
              <OrderForm />
            </PrivateRoute>
          } />
          <Route path="/confirmation/:id" element={
            <PrivateRoute>
              <Confirmation />
            </PrivateRoute>
          } />
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }>
            <Route index element={<div>Selamat datang di dashboard</div>} />
            <Route path="film" element={<FilmManage />} />
            <Route path="jadwal" element={<JadwalManage />} />
            <Route path="pembeli" element={<PembeliList />} />
            <Route path="booking" element={<BookingSelectFilm />} />
            <Route path="booking/film/:filmId" element={<BookingSelectSchedule />} />
            <Route path="booking/seat/:jadwalId" element={<OrderForm />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;