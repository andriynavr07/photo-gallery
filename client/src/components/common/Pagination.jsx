export default function Pagination({ page, total, pageSize, onChange }) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null
  return (
    <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginTop:'16px' }}>
      <button onClick={() => onChange(page - 1)} disabled={page <= 1}>←</button>
      <span>{page} / {totalPages}</span>
      <button onClick={() => onChange(page + 1)} disabled={page >= totalPages}>→</button>
    </div>
  )
}
