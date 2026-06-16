import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authApi = {
  login: (data) => api.post('/auth/login', data)
}

export const albumsApi = {
  getAll: (page = 1) => api.get(`/albums?page=${page}&pageSize=5`),
  getMy: () => api.get('/albums/my'),
  create: (data) => api.post('/albums', data),
  delete: (id) => api.delete(`/albums/${id}`),
  getImages: (id, page = 1) => api.get(`/albums/${id}/images?page=${page}&pageSize=5`),
  uploadImage: (id, file) => {
    const form = new FormData()
    form.append('file', file)
    return api.post(`/albums/${id}/images`, form)
  }
}

export const imagesApi = {
  delete: (id) => api.delete(`/images/${id}`),
  like: (id, isLike) => api.post(`/images/${id}/like`, { isLike })
}
