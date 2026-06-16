import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const { loginUser } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await login(form)
      loginUser(data.token)
      navigate('/albums')
    } catch {
      setError('Invalid username or password')
    }
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2>Sign In</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input style={styles.input} placeholder="Username" value={form.username}
          onChange={e => setForm(f => ({ ...f, username: e.target.value }))} required />
        <input style={styles.input} type="password" placeholder="Password" value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
        <button type="submit" style={styles.btn}>Login</button>
      </form>
    </div>
  )
}

const styles = {
  wrapper: { display:'flex', justifyContent:'center', alignItems:'center', minHeight:'80vh' },
  form: { display:'flex', flexDirection:'column', gap:'12px', width:'300px', padding:'32px', background:'white', borderRadius:'8px', boxShadow:'0 2px 12px rgba(0,0,0,0.1)' },
  input: { padding:'10px', border:'1px solid #ddd', borderRadius:'4px', fontSize:'14px' },
  btn: { padding:'10px', background:'#1a1a2e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'15px' },
  error: { color:'red', fontSize:'13px', margin:0 }
}
