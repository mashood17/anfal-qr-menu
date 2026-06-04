import axios from 'axios'
import useAuthStore from '@/store/authStore'

const API_URL = import.meta.env.VITE_API_URL

export async function uploadImage(file, folder = 'general') {
  const formData = new FormData()

  formData.append('file', file)
  formData.append('folder', folder)

  const token = useAuthStore.getState().token

  const res = await axios.post(
    `${API_URL}/upload`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  return res.data.data
}