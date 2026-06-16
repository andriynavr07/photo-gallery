import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    if (!token) return null
    const payload = parseJwt(token)
    return payload ? { username: payload.unique_name, role: payload.role, userId: payload.userId } : null
  })

  const loginUser = (token) => {
    localStorage.setItem('token', token)
    const payload = parseJwt(token)
    setUser({ username: payload.unique_name, role: payload.role, userId: payload.userId })
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
