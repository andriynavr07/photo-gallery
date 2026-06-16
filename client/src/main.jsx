import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/common/Navbar'
import LoginPage from './pages/LoginPage'
import AlbumsPage from './pages/AlbumsPage'
import AlbumPage from './pages/AlbumPage'
import MyAlbumsPage from './pages/MyAlbumsPage'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <div style={{ minHeight:'100vh', background:'#f7f8fa', fontFamily:'system-ui, sans-serif' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Navigate to="/albums" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/albums" element={<AlbumsPage />} />
            <Route path="/albums/:id" element={<AlbumPage />} />
            <Route path="/my-albums" element={
              <PrivateRoute><MyAlbumsPage /></PrivateRoute>
            } />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
