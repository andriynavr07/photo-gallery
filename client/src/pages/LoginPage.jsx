import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, register } from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const fn = mode === 'login' ? login : register
      const { data } = await fn(form)
      loginUser(data.token)
      navigate('/albums')
    } catch (err) {
      setError(err.response?.data?.error || (mode === 'login' ? 'Invalid credentials' : 'Registration failed'))
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={{ margin: 0 }}>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input style={styles.input} placeholder="Username" value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        <input style={styles.input} type="password" placeholder="Password" value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />

        <button type="submit" style={styles.btn}>
          {mode === 'login' ? 'Login' : 'Register'}
        </button>

        <p style={styles.toggle}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button type="button" onClick={() => { setMode(m => m === 'login' ? 'register' : 'login'); setError('') }} style={styles.switchBtn}>
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </form>
    </div>
  )
}

const styles = {
  wrapper: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh' },
  form: { display:'flex', flexDirection:'column', gap:'12px', width:'320px', padding:'32px', background:'white', borderRadius:'8px', boxShadow:'0 2px 12px rgba(0,0,0,0.1)' },
  input: { padding:'10px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px' },
  btn: { padding:'10px', background:'#1a1a2e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'15px' },
  error: { color:'red', fontSize:'13px', margin:0, padding:'8px', background:'#fff5f5', borderRadius:'4px' },
  toggle: { margin:0, fontSize:'13px', color:'#555', textAlign:'center' },
  switchBtn: { background:'none', border:'none', color:'#1a1a2e', cursor:'pointer', fontWeight:'bold', textDecoration:'underline', fontSize:'13px' }
}
