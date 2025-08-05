import { BASE_URL } from '@/lib/urls'
import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'admin-token'
const USER_DATA = 'admin-user' // Add user data cookie key

interface User {
  name: string
  email: string
}

interface AuthState {
  auth: {
    user: User | null
    setUser: (user: User) => void
    accessToken: string
    setAccessToken: (accessToken: string) => void
    resetAccessToken: () => void
    reset: () => void
  }
}

export async function logout() {
  await fetch(`${BASE_URL}/api/admins/logout`,{
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${Cookies.get(ACCESS_TOKEN)}`,
    },
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Logout failed:', error)
  })
  Cookies.remove(ACCESS_TOKEN)
  Cookies.remove(USER_DATA) // Remove user data cookie
  window.location.href = '/sign-in'
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const userCookie = Cookies.get(USER_DATA)
  
  const initToken = cookieState || ''
  const initUser = userCookie ? JSON.parse(userCookie) : null // Parse user data from cookie
  
  return {
    auth: {
      user: initUser,
      setUser: (user) =>
        set((state) => {
          // Store user data in cookie
          Cookies.set(USER_DATA, JSON.stringify(user))
          return { ...state, auth: { ...state.auth, user } }
        }),
      accessToken: initToken,
      setAccessToken: (accessToken) =>
        set((state) => {
          Cookies.set(ACCESS_TOKEN, accessToken)
          return { ...state, auth: { ...state.auth, accessToken } }
        }),
      resetAccessToken: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          return { ...state, auth: { ...state.auth, accessToken: '' } }
        }),
      reset: () =>
        set((state) => {
          Cookies.remove(ACCESS_TOKEN)
          Cookies.remove(USER_DATA) // Remove user data cookie
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
