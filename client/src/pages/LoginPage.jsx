import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await authApi.login(form)
      login(data.token)
      navigate('/albums')
    } catch {
      setError('Invalid username or password')
    } finally { setLoading(false) }
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ marginBottom:'24px', color:'white' }}>Sign In</h2>
        {error && <div style={styles.error}>{error}</div>}
        <input style={styles.input} placeholder="Username" value={form.username}
          onChange={e => setForm(f => ({...f, username: e.target.value}))} required />
        <input style={styles.input} type="password" placeholder="Password" value={form.password}
          onChange={e => setForm(f => ({...f, password: e.target.value}))} required />
        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p style={{ color:'#aaa', marginTop:'12px', fontSize:'0.85rem' }}>
          Default admin: <strong style={{color:'white'}}>admin / Admin123!</strong>
        </p>
      </form>
    </div>
  )
}

const styles = {
  container: { minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center' },
  form: { background:'#1a1a2e', padding:'40px', borderRadius:'12px', width:'320px', display:'flex', flexDirection:'column', gap:'12px' },
  input: { padding:'10px 14px', borderRadius:'6px', border:'1px solid #444', background:'#0f3460', color:'white', fontSize:'1rem' },
  btn: { padding:'12px', background:'#6c63ff', color:'white', border:'none', borderRadius:'6px', fontSize:'1rem', cursor:'pointer' },
  error: { background:'#ff4444', color:'white', padding:'8px 12px', borderRadius:'6px', fontSize:'0.9rem' }
}
