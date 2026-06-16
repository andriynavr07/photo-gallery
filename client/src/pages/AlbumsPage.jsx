import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAlbums, deleteAlbum } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/common/Pagination'

export default function AlbumsPage() {
  const [data, setData] = useState({ items: [], total: 0 })
  const [page, setPage] = useState(1)
  const { isAdmin } = useAuth()

  const load = async (p = page) => {
    const res = await getAlbums(p)
    setData(res.data)
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (id) => {
    if (!confirm('Delete this album?')) return
    await deleteAlbum(id)
    load(page)
  }

  return (
    <div style={styles.container}>
      <h2>All Albums</h2>
      <div style={styles.grid}>
        {data.items.map(album => (
          <div key={album.id} style={styles.card}>
            <Link to={`/albums/${album.id}`}>
              <div style={styles.cover}>
                {album.coverUrl
                  ? <img src={album.coverUrl} alt={album.title} style={styles.img} />
                  : <div style={styles.placeholder}>No photos</div>}
              </div>
              <div style={styles.info}>
                <strong>{album.title}</strong>
                <span style={styles.meta}>{album.imageCount} photos · by {album.ownerName}</span>
              </div>
            </Link>
            {isAdmin && (
              <button onClick={() => handleDelete(album.id)} style={styles.delBtn}>🗑 Delete</button>
            )}
          </div>
        ))}
      </div>
      <Pagination page={page} total={data.total} pageSize={5} onChange={setPage} />
    </div>
  )
}

const styles = {
  container: { maxWidth:'900px', margin:'0 auto', padding:'24px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'16px' },
  card: { background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.1)', position:'relative' },
  cover: { height:'160px', background:'#eee', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  placeholder: { height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#aaa' },
  info: { padding:'12px', display:'flex', flexDirection:'column', gap:'4px' },
  meta: { fontSize:'12px', color:'#888' },
  delBtn: { position:'absolute', top:'8px', right:'8px', background:'#e53e3e', color:'white', border:'none', borderRadius:'4px', padding:'4px 8px', cursor:'pointer', fontSize:'12px' }
}
