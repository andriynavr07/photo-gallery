import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return { username: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
             role: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
             id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] }
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    return token ? parseJwt(token) : null
  })

  const login = (token) => {
    localStorage.setItem('token', token)
    setUser(parseJwt(token))
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAdmin: user?.role === 'Admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
