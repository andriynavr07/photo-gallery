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

  // userId as number for comparison
  const userId = user ? Number(user.userId) : null

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
    } catch (err) {
      alert(err.response?.data?.error || 'Upload failed')
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

  // Current user is owner of the album if they own any image in it
  // We use albumOwnerId from image DTO
  const canUpload = (img) => userId !== null && img.albumOwnerId === userId
  const isAlbumOwner = data.items.length > 0 && userId !== null && data.items[0].albumOwnerId === userId
  const canDeleteImage = (img) => isAdmin || (userId !== null && img.albumOwnerId === userId)

  return (
    <div style={styles.container}>
      <h2>Album Photos</h2>

      {/* Show upload only to album owner */}
      {isAlbumOwner && (
        <label style={{ ...styles.uploadLabel, opacity: uploading ? 0.6 : 1 }}>
          {uploading ? 'Uploading...' : '+ Upload Photo'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display:'none' }} disabled={uploading} />
        </label>
      )}

      <div style={styles.grid}>
        {data.items.map(img => (
          <div key={img.id} style={styles.card}>
            <img src={img.url} alt="" style={styles.thumb} onClick={() => setLightbox(img.url)} />

            <div style={styles.actions}>
              {user ? (
                <>
                  <button
                    onClick={() => handleLike(img.id, true)}
                    style={img.currentUserLike === true ? styles.activeLike : styles.actionBtn}
                    title="Like"
                  >
                    👍 {img.likes}
                  </button>
                  <button
                    onClick={() => handleLike(img.id, false)}
                    style={img.currentUserLike === false ? styles.activeDislike : styles.actionBtn}
                    title="Dislike"
                  >
                    👎 {img.dislikes}
                  </button>
                </>
              ) : (
                <span style={styles.counts}>👍 {img.likes} &nbsp; 👎 {img.dislikes}</span>
              )}

              {/* Delete: only admin or album owner */}
              {canDeleteImage(img) && (
                <button onClick={() => handleDelete(img.id)} style={styles.delBtn} title="Delete">🗑</button>
              )}
            </div>
          </div>
        ))}

        {data.items.length === 0 && (
          <p style={{ color:'#888', gridColumn:'1/-1' }}>No photos in this album yet.</p>
        )}
      </div>

      <Pagination page={page} total={data.total} pageSize={5} onChange={p => { setPage(p); load(p) }} />

      {lightbox && (
        <div style={styles.overlay} onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="" style={styles.lightboxImg} onClick={e => e.stopPropagation()} />
          <button style={styles.closeBtn} onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth:'960px', margin:'0 auto', padding:'24px' },
  uploadLabel: { display:'inline-block', marginBottom:'20px', padding:'8px 18px', background:'#1a1a2e', color:'white', borderRadius:'4px', cursor:'pointer' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px,1fr))', gap:'16px' },
  card: { background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.1)' },
  thumb: { width:'100%', height:'160px', objectFit:'cover', cursor:'zoom-in', display:'block' },
  actions: { padding:'8px', display:'flex', gap:'6px', alignItems:'center', flexWrap:'wrap' },
  actionBtn: { padding:'4px 8px', border:'1px solid #ddd', borderRadius:'4px', background:'white', cursor:'pointer', fontSize:'13px' },
  activeLike: { padding:'4px 8px', border:'1px solid #38a169', borderRadius:'4px', background:'#f0fff4', cursor:'pointer', fontSize:'13px', fontWeight:'bold' },
  activeDislike: { padding:'4px 8px', border:'1px solid #e53e3e', borderRadius:'4px', background:'#fff5f5', cursor:'pointer', fontSize:'13px', fontWeight:'bold' },
  counts: { fontSize:'13px', color:'#666' },
  delBtn: { marginLeft:'auto', padding:'4px 8px', background:'#e53e3e', color:'white', border:'none', borderRadius:'4px', cursor:'pointer', fontSize:'12px' },
  overlay: { position:'fixed', inset:0, background:'rgba(0,0,0,0.88)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 },
  lightboxImg: { maxWidth:'90vw', maxHeight:'90vh', objectFit:'contain', borderRadius:'4px', cursor:'default' },
  closeBtn: { position:'absolute', top:'20px', right:'24px', background:'none', border:'none', color:'white', fontSize:'28px', cursor:'pointer' }
}
