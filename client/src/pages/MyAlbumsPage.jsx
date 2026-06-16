import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getMyAlbums, createAlbum, deleteAlbum } from '../api'

export default function MyAlbumsPage() {
  const [albums, setAlbums] = useState([])
  const [form, setForm] = useState({ title: '', description: '' })
  const [creating, setCreating] = useState(false)

  const load = async () => {
    const res = await getMyAlbums()
    setAlbums(res.data)
  }

  useEffect(() => { load() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    await createAlbum(form)
    setForm({ title: '', description: '' })
    setCreating(false)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this album and all its photos?')) return
    await deleteAlbum(id)
    load()
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>My Albums</h2>
        <button onClick={() => setCreating(c => !c)} style={styles.addBtn}>+ New Album</button>
      </div>

      {creating && (
        <form onSubmit={handleCreate} style={styles.form}>
          <input style={styles.input} placeholder="Album title" value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          <input style={styles.input} placeholder="Description (optional)" value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div style={{ display:'flex', gap:'8px' }}>
            <button type="submit" style={styles.btn}>Create</button>
            <button type="button" onClick={() => setCreating(false)} style={styles.cancelBtn}>Cancel</button>
          </div>
        </form>
      )}

      <div style={styles.grid}>
        {albums.map(album => (
          <div key={album.id} style={styles.card}>
            <Link to={`/albums/${album.id}`} style={styles.link}>
              <div style={styles.cover}>
                {album.coverUrl
                  ? <img src={album.coverUrl} alt={album.title} style={styles.img} />
                  : <div style={styles.placeholder}>No photos yet</div>}
              </div>
              <div style={styles.info}>
                <strong>{album.title}</strong>
                <span style={styles.meta}>{album.imageCount} photos</span>
              </div>
            </Link>
            <button onClick={() => handleDelete(album.id)} style={styles.delBtn}>🗑</button>
          </div>
        ))}
        {albums.length === 0 && !creating && (
          <p style={{ color:'#888' }}>No albums yet. Create your first one!</p>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'24px' },
  header: { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'16px' },
  addBtn: { background:'#1a1a2e', color:'white', border:'none', padding:'8px 16px', borderRadius:'4px', cursor:'pointer' },
  form: { display:'flex', flexDirection:'column', gap:'8px', marginBottom:'24px', padding:'16px', background:'white', borderRadius:'8px', boxShadow:'0 1px 4px rgba(0,0,0,0.1)' },
  input: { padding:'8px', border:'1px solid #ddd', borderRadius:'4px' },
  btn: { padding:'8px 16px', background:'#38a169', color:'white', border:'none', borderRadius:'4px', cursor:'pointer' },
  cancelBtn: { padding:'8px 16px', background:'#e2e8f0', border:'none', borderRadius:'4px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'16px' },
  card: { background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', position:'relative' },
  link: { textDecoration:'none', color:'inherit' },
  cover: { height:'140px', background:'#eee', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  placeholder: { height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa', fontSize:'13px' },
  info: { padding:'10px', display:'flex', flexDirection:'column', gap:'4px' },
  meta: { fontSize:'12px', color:'#888' },
  delBtn: { position:'absolute', top:'8px', right:'8px', background:'#e53e3e', color:'white', border:'none', borderRadius:'4px', padding:'4px 8px', cursor:'pointer' }
}
