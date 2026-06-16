import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { albumsApi } from '../api'

export default function MyAlbumsPage() {
  const [albums, setAlbums] = useState([])
  const [form, setForm] = useState({ title: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try { const res = await albumsApi.getMy(); setAlbums(res.data) }
    finally { setLoading(false) }
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await albumsApi.create(form)
    setForm({ title: '', description: '' })
    setShowForm(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this album?')) return
    await albumsApi.delete(id)
    load()
  }

  return (
    <div style={styles.container}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
        <h1 style={{ color:'white' }}>My Albums</h1>
        <button onClick={() => setShowForm(!showForm)} style={styles.createBtn}>
          {showForm ? '✕ Cancel' : '+ New Album'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input style={styles.input} placeholder="Album title" value={form.title}
            onChange={e => setForm(f => ({...f, title: e.target.value}))} required />
          <input style={styles.input} placeholder="Description (optional)" value={form.description}
            onChange={e => setForm(f => ({...f, description: e.target.value}))} />
          <button type="submit" style={styles.createBtn}>Create Album</button>
        </form>
      )}

      {loading ? <p style={{color:'#aaa'}}>Loading...</p> : albums.length === 0
        ? <p style={{color:'#aaa'}}>No albums yet. Create your first one!</p>
        : (
          <div style={styles.grid}>
            {albums.map(album => (
              <div key={album.id} style={styles.card}>
                <Link to={`/albums/${album.id}`} style={{ textDecoration:'none', color:'white' }}>
                  <div style={styles.cover}>
                    {album.coverUrl
                      ? <img src={album.coverUrl} alt={album.title} style={styles.img} />
                      : <div style={styles.placeholder}>📷</div>}
                  </div>
                  <div style={styles.info}>
                    <h3 style={styles.albumTitle}>{album.title}</h3>
                    <p style={styles.meta}>{album.imageCount} photos</p>
                  </div>
                </Link>
                <button onClick={() => handleDelete(album.id)} style={styles.deleteBtn}>🗑</button>
              </div>
            ))}
          </div>
        )
      }
    </div>
  )
}

const styles = {
  container: { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  createBtn: { background:'#6c63ff', border:'none', color:'white', padding:'10px 20px', borderRadius:'6px', cursor:'pointer', fontSize:'0.95rem' },
  form: { background:'#1a1a2e', padding:'20px', borderRadius:'10px', display:'flex', gap:'12px', marginBottom:'24px', flexWrap:'wrap' },
  input: { padding:'10px 14px', borderRadius:'6px', border:'1px solid #444', background:'#0f3460', color:'white', fontSize:'1rem', flex:1 },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px' },
  card: { background:'#1a1a2e', borderRadius:'10px', overflow:'hidden', position:'relative' },
  cover: { height:'150px', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  placeholder: { height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', background:'#0f3460' },
  info: { padding:'12px' },
  albumTitle: { margin:'0 0 4px', fontSize:'1rem' },
  meta: { margin:0, color:'#aaa', fontSize:'0.8rem' },
  deleteBtn: { position:'absolute', top:'8px', right:'8px', background:'#ff4444', border:'none', color:'white', padding:'4px 8px', borderRadius:'4px', cursor:'pointer' }
}
