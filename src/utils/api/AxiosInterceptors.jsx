import axios from 'axios'
import { store } from '../../components/store/store'

const Api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_END_POINT}/`
})

Api.interceptors.request.use(function (config) {
  let token = undefined

  if (typeof window !== 'undefined') {
    const state = store.getState()
    token = state?.user?.data?.token
  }

  if (token) config.headers.authorization = `Bearer ${token}`

  return config
})
export default Api
