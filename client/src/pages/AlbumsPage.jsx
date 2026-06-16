import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { albumsApi } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/common/Pagination'

export default function AlbumsPage() {
  const [data, setData] = useState({ items: [], total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const load = async (p) => {
    setLoading(true)
    try {
      const res = await albumsApi.getAll(p)
      setData(res.data)
    } finally { setLoading(false) }
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (id) => {
    if (!confirm('Delete this album?')) return
    await albumsApi.delete(id)
    load(page)
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Albums</h1>
      {loading ? <p style={{color:'#aaa'}}>Loading...</p> : (
        <>
          <div style={styles.grid}>
            {data.items.map(album => (
              <div key={album.id} style={styles.card}>
                <Link to={`/albums/${album.id}`} style={{ textDecoration:'none', color:'white' }}>
                  <div style={styles.cover}>
                    {album.coverUrl
                      ? <img src={album.coverUrl} alt={album.title} style={styles.img} />
                      : <div style={styles.placeholder}>📷</div>}
                  </div>
                  <div style={styles.info}>
                    <h3 style={styles.albumTitle}>{album.title}</h3>
                    <p style={styles.meta}>{album.imageCount} photos · by {album.ownerName}</p>
                  </div>
                </Link>
                {isAdmin && (
                  <button onClick={() => handleDelete(album.id)} style={styles.deleteBtn}>🗑 Delete</button>
                )}
              </div>
            ))}
          </div>
          <Pagination page={page} total={data.total} pageSize={5} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

const styles = {
  container: { maxWidth:'1100px', margin:'0 auto', padding:'32px 16px' },
  title: { color:'white', marginBottom:'24px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:'20px' },
  card: { background:'#1a1a2e', borderRadius:'10px', overflow:'hidden', position:'relative' },
  cover: { height:'150px', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  placeholder: { height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', background:'#0f3460' },
  info: { padding:'12px' },
  albumTitle: { margin:'0 0 4px', fontSize:'1rem' },
  meta: { margin:0, color:'#aaa', fontSize:'0.8rem' },
  deleteBtn: { position:'absolute', top:'8px', right:'8px', background:'#ff4444', border:'none', color:'white', padding:'4px 8px', borderRadius:'4px', cursor:'pointer', fontSize:'0.8rem' }
}
