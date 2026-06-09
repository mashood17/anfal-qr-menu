import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 45000,
  headers: { 'Content-Type': 'application/json' },
})

client.interceptors.response.use(
  (res) => {
    console.log('API RESPONSE >>>', res.config.url)
    console.log(res.data)
    return res.data.data
  },
  (err) => {
    console.error('API ERROR >>>', err)
    const message =
      err.response?.data?.message ||
      'Something went wrong'
    return Promise.reject(new Error(message))
  }
)

export default client