export default function Pagination({ page, total, pageSize, onPageChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  return (
    <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'24px' }}>
      <button disabled={page === 1} onClick={() => onPageChange(page - 1)} style={btnStyle}>←</button>
      {Array.from({ length: totalPages }, (_, i) => (
        <button key={i+1} onClick={() => onPageChange(i+1)}
          style={{ ...btnStyle, background: page === i+1 ? '#6c63ff' : '#333' }}>
          {i+1}
        </button>
      ))}
      <button disabled={page === totalPages} onClick={() => onPageChange(page + 1)} style={btnStyle}>→</button>
    </div>
  )
}

const btnStyle = { padding:'8px 14px', border:'none', borderRadius:'4px', background:'#333', color:'white', cursor:'pointer' }
