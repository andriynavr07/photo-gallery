import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getImages, uploadImage, deleteImage, toggleLike } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/common/Pagination'

export default function AlbumPage() {
  const { id } = useParams()
  const { user, isAdmin } = useAuth()
  const [data, setData] = useState({ items: [], total: 0 })
  const [page, setPage] = useState(1)
  const [lightbox, setLightbox] = useState(null)
  const [uploading, setUploading] = useState(false)

  const load = async (p = page) => {
    const res = await getImages(id, p)
    setData(res.data)
  }

  useEffect(() => { load(page) }, [page, id])

  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      await uploadImage(id, file)
      load(page)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (imgId) => {
    if (!confirm('Delete this image?')) return
    await deleteImage(imgId)
    load(page)
  }

  const handleLike = async (imgId, isLike) => {
    await toggleLike(imgId, isLike)
    load(page)
  }

  return (
    <div style={styles.container}>
      <h2>Album Photos</h2>

      {user && (
        <label style={styles.uploadLabel}>
          {uploading ? 'Uploading...' : '+ Upload Photo'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display:'none' }} disabled={uploading} />
        </label>
      )}

      <div style={styles.grid}>
        {data.items.map(img => (
          <div key={img.id} style={styles.card}>
            <img src={img.url} alt="" style={styles.thumb} onClick={() => setLightbox(img)} />
            <div style={styles.actions}>
              {user && (
                <>
                  <button onClick={() => handleLike(img.id, true)} style={img.currentUserLike === true ? styles.activeLike : styles.actionBtn}>
                    👍 {img.likes}
                  </button>
                  <button onClick={() => handleLike(img.id, false)} style={img.currentUserLike === false ? styles.activeDislike : styles.actionBtn}>
                    👎 {img.dislikes}
                  </button>
                </>
              )}
              {!user && (
                <span style={styles.counts}>👍 {img.likes} · 👎 {img.dislikes}</span>
              )}
              {(isAdmin || user) && (
                <button onClick={() => handleDelete(img.id)} style={styles.delBtn}>🗑</button>
              )}
            </div>
          </div>
        ))}
        {data.items.length === 0 && <p style={{ color:'#888' }}>No photos in this album yet.</p>}
      </div>

      <Pagination page={page} total={data.total} pageSize={5} onChange={setPage} />

      {lightbox && (
        <div style={styles.lightboxOverlay} onClick={() => setLightbox(null)}>
          <img src={lightbox.url} alt="" style={styles.lightboxImg} onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'24px' },
  uploadLabel: { display:'inline-block', marginBottom:'16px', padding:'8px 16px', background:'#1a1a2e', color:'white', borderRadius:'4px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'16px' },
  card: { background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  thumb: { width:'100%', height:'160px', objectFit:'cover', cursor:'zoom-in' },
  actions: { padding:'8px', display:'flex', gap:'6px', alignItems:'center' },
  actionBtn: { padding:'4px 8px', border:'1px solid #ddd', borderRadius:'4px', background:'white', cursor:'pointer', fontSize:'13px' },
  activeLike: { padding:'4px 8px', border:'1px solid #38a169', borderRadius:'4px', background:'#f0fff4', cursor:'pointer', fontSize:'13px' },
  activeDislike: { padding:'4px 8px', border:'1px solid #e53e3e', borderRadius:'4px', background:'#fff5f5', cursor:'pointer', fontSize:'13px' },
  counts: { fontSize:'13px', color:'#666' },
  delBtn: { marginLeft:'auto', padding:'4px 8px', background:'#e53e3e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px' },
  lightboxOverlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, cursor:'zoom-out' },
  lightboxImg: { maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:'4px' }
}
