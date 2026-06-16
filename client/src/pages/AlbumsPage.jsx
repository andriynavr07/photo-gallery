import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAlbums, deleteAlbum } from '../api'
import { useAuth } from '../context/AuthContext'
import Pagination from '../components/common/Pagination'

export default function AlbumsPage() {
  const [data, setData] = useState({ items: [], total: 0 })
  const [page, setPage] = useState(1)
  const { isAdmin } = useAuth()

  const load = async (p) => {
    const res = await getAlbums(p)
    setData(res.data)
  }

  useEffect(() => { load(page) }, [page])

  const handleDelete = async (id, e) => {
    e.preventDefault()
    if (!confirm('Delete this album and all its photos?')) return
    await deleteAlbum(id)
    load(page)
  }

  return (
    <div style={styles.container}>
      <h2>All Albums</h2>
      {data.items.length === 0 && <p style={{ color:'#888' }}>No albums yet.</p>}
      <div style={styles.grid}>
        {data.items.map(album => (
          <Link to={`/albums/${album.id}`} key={album.id} style={styles.cardLink}>
            <div style={styles.card}>
              <div style={styles.cover}>
                {album.coverUrl
                  ? <img src={album.coverUrl} alt={album.title} style={styles.img} />
                  : <div style={styles.placeholder}>📷 No photos</div>}
              </div>
              <div style={styles.info}>
                <strong style={styles.title}>{album.title}</strong>
                {album.description && <span style={styles.desc}>{album.description}</span>}
                <span style={styles.meta}>{album.imageCount} photos · {album.ownerName}</span>
              </div>
              {isAdmin && (
                <button onClick={(e) => handleDelete(album.id, e)} style={styles.delBtn} title="Delete album">
                  🗑
                </button>
              )}
            </div>
          </Link>
        ))}
      </div>
      <Pagination page={page} total={data.total} pageSize={5} onChange={setPage} />
    </div>
  )
}

const styles = {
  container: { maxWidth:'960px', margin:'0 auto', padding:'24px' },
  grid: { display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'16px' },
  cardLink: { textDecoration:'none', color:'inherit' },
  card: { background:'white', borderRadius:'8px', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.08)', position:'relative', transition:'box-shadow .2s' },
  cover: { height:'160px', background:'#f0f0f0', overflow:'hidden' },
  img: { width:'100%', height:'100%', objectFit:'cover' },
  placeholder: { height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#bbb', fontSize:'14px' },
  info: { padding:'12px', display:'flex', flexDirection:'column', gap:'4px' },
  title: { fontSize:'15px' },
  desc: { fontSize:'12px', color:'#777', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' },
  meta: { fontSize:'12px', color:'#aaa', marginTop:'2px' },
  delBtn: { position:'absolute', top:'8px', right:'8px', background:'rgba(229,62,62,0.9)', color:'white', border:'none', borderRadius:'4px', padding:'5px 9px', cursor:'pointer', fontSize:'13px' }
}
