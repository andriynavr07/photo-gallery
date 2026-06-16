import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <nav style={styles.nav}>
      <Link to="/albums" style={styles.brand}>📷 Photo Gallery</Link>
      <div style={styles.links}>
        <Link to="/albums" style={styles.link}>Albums</Link>
        {user && <Link to="/my-albums" style={styles.link}>My Albums</Link>}
        {user
          ? <button onClick={handleLogout} style={styles.btn}>Logout ({user.username})</button>
          : <Link to="/login" style={styles.link}>Login</Link>}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 24px', background:'#1a1a2e', color:'white' },
  brand: { color:'white', textDecoration:'none', fontSize:'1.2rem', fontWeight:'bold' },
  links: { display:'flex', gap:'16px', alignItems:'center' },
  link: { color:'#ccc', textDecoration:'none' },
  btn: { background:'transparent', border:'1px solid #ccc', color:'#ccc', padding:'4px 12px', cursor:'pointer', borderRadius:'4px' }
}
