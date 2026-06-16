import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { albumsApi, imagesApi } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/common/Pagination'

export default function AlbumPage() {
  const { id } = useParams()
  const [data, setData] = useState({ items: [], total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [fullscreen, setFullscreen] = useState(null)
  const [uploading, setUploading] = useState(false)
  const { user, isAdmin } = useAuth()

  const load = useCallback(async (p) => {
    setLoading(true)
    try { const res = await albumsApi.getImages(id, p); setData(res.data) }
    finally { setLoading(false) }
  }, [id])

  useEffect(() => { load(page) }, [page, load])

  const handleLike = async (imageId, isLike) => {
    const res = await imagesApi.like(imageId, isLike)
    setData(d => ({ ...d, items: d.items.map(img => img.id === imageId ? res.data : img) }))
  }

  const handleDelete = async (imageId) => {
    if (!confirm('Delete this image?')) return
    await imagesApi.delete(imageId)
    load(page)
  }

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try { await albumsApi.uploadImage(id, file); load(page) }
    finally { setUploading(false) }
  }

  const canDelete = (img) => isAdmin || (user && img.albumOwnerId === parseInt(user.id))

  return (
    <div style={styles.container}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'24px' }}>
        <h1 style={{ color:'white' }}>Album</h1>
        {user && (
          <label style={styles.uploadBtn}>
            {uploading ? 'Uploading...' : '+ Upload Photo'}
            <input type="file" accept="image/*" onChange={handleUpload} style={{ display:'none' }} />
          </label>
        )}
      </div>

      {loading ? <p style={{color:'#aaa'}}>Loading...</p> : data.items.length === 0
        ? <p style={{color:'#aaa'}}>No images in this album yet.</p>
        : (
          <>
            <div style={styles.grid}>
              {data.items.map(img => (
                <div key={img.id} style={styles.card}>
                  <img src={img.url} alt="" style={styles.thumb} onClick={() => setFullscreen(img)} />
                  <div style={styles.actions}>
                    {user && (
                      <>
                        <button onClick={() => handleLike(img.id, true)}
                          style={{ ...styles.likeBtn, background: img.currentUserLike === true ? '#4caf50' : '#333' }}>
                          👍 {img.likes}
                        </button>
                        <button onClick={() => handleLike(img.id, false)}
                          style={{ ...styles.likeBtn, background: img.currentUserLike === false ? '#f44336' : '#333' }}>
                          👎 {img.dislikes}
                        </button>
                      </>
                    )}
                    {!user && (
                      <span style={styles.counts}>👍 {img.likes} · 👎 {img.dislikes}</span>
                    )}
                    {canDelete(img) && (
                      <button onClick={() => handleDelete(img.id)} style={styles.deleteBtn}>🗑</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Pagination page={page} total={data.total} pageSize={5} onPageChange={setPage} />
          </>
        )
      }

      {fullscreen && (
        <div style={styles.overlay} onClick={() => setFullscreen(null)}>
          <img src={fullscreen.url} alt="" style={styles.fullImg} onClick={e => e.stopPropagation()} />
          <button onClick={() => setFullscreen(null)} style={styles.closeBtn}>✕</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  uploadBtn: { background:'#6c63ff', color:'white', padding:'10px 20px', borderRadius:'6px', cursor:'pointer', fontSize:'0.95rem' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'16px' },
  card: { background:'#1a1a2e', borderRadius:'10px', overflow:'hidden' },
  thumb: { width:'100%', height:'160px', objectFit:'cover', cursor:'pointer', display:'block' },
  actions: { padding:'8px', display:'flex', gap:'6px', alignItems:'center' },
  likeBtn: { border:'none', color:'white', padding:'4px 10px', borderRadius:'4px', cursor:'pointer', fontSize:'0.85rem' },
  counts: { color:'#aaa', fontSize:'0.85rem' },
  deleteBtn: { marginLeft:'auto', background:'#ff4444', border:'none', color:'white', padding:'4px 8px', borderRadius:'4px', cursor:'pointer' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.9)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
  fullImg: { maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:'8px' },
  closeBtn: { position:'absolute', top:'20px', right:'20px', background:'transparent', border:'none', color:'white', fontSize:'2rem', cursor:'pointer' }
}
