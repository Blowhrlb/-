import axios, { type AxiosRequestConfig } from 'axios'
import { useUserStore } from '@/store'

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const { code, status, message, data } = response.data
    // 兼容 code: 200 或 status: 'success' 两种格式
    if (code === 200 || status === 'success') {
      return data
    }
    if (code === 301) {//验证码错误或者过期
      return data;
    }
    return Promise.reject(new Error(message || '请求失败'))
  },
  (error) => {
    // if (error.response?.status === 401) {
    //   // 未登录或token过期
    //   const userStore = useUserStore()
    //   userStore.logout()
    //   // 触发自定义事件，通知 App.vue 弹出登录框
    //   window.dispatchEvent(new CustomEvent('show-login-modal'))
    // }
    return Promise.reject(error)
  }
)

export default request

export function get<T = any>(url: string, params?: object, config?: AxiosRequestConfig): Promise<T> {
  return request.get(url, { params, ...config })
}

export function post<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
  return request.post(url, data, config)
}

export function put<T = any>(url: string, data?: object, config?: AxiosRequestConfig): Promise<T> {
  return request.put(url, data, config)
}

export function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
  return request.delete(url, config)
}

export function upload<T = any>(url: string, file: File, onProgress?: (progress: number) => void): Promise<T> {
  const formData = new FormData()
  formData.append('file', file)

  return request.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total && onProgress) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}
