import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Albums
export const getAlbums = (page = 1) => api.get(`/albums?page=${page}&pageSize=5`)
export const getMyAlbums = () => api.get('/albums/my')
export const createAlbum = (data) => api.post('/albums', data)
export const deleteAlbum = (id) => api.delete(`/albums/${id}`)

// Images
export const getImages = (albumId, page = 1) => api.get(`/albums/${albumId}/images?page=${page}&pageSize=5`)
export const uploadImage = (albumId, file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post(`/albums/${albumId}/images`, form)
}
export const deleteImage = (id) => api.delete(`/images/${id}`)
export const toggleLike = (id, isLike) => api.post(`/images/${id}/like`, { isLike })

// Auth
export const login = (data) => api.post('/auth/login', data)
