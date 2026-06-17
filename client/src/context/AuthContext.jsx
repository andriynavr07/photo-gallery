import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }
}

function userFromToken(token) {
  const payload = parseJwt(token)
  if (!payload) return null
  return {
    userId: payload.userId,       // "userId" claim
    username: payload.username,   // "username" claim
    role: payload.role            // "role" claim
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    return token ? userFromToken(token) : null
  })

  const loginUser = (token) => {
    localStorage.setItem('token', token)
    setUser(userFromToken(token))
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loginUser, logout, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
