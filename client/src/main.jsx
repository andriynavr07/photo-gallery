import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/common/PrivateRoute'
import Navbar from './components/common/Navbar'
import LoginPage from './pages/LoginPage'
import AlbumsPage from './pages/AlbumsPage'
import MyAlbumsPage from './pages/MyAlbumsPage'
import AlbumPage from './pages/AlbumPage'

const globalStyle = document.createElement('style')
globalStyle.innerHTML = `* { box-sizing: border-box; margin: 0; padding: 0; } body { background: #0f0f1a; font-family: system-ui, sans-serif; }`
document.head.appendChild(globalStyle)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/albums" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/albums" element={<AlbumsPage />} />
          <Route path="/albums/:id" element={<AlbumPage />} />
          <Route path="/my-albums" element={<PrivateRoute><MyAlbumsPage /></PrivateRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
)
