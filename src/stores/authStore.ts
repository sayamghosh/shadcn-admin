import { BASE_URL } from '@/lib/urls'
import Cookies from 'js-cookie'
import { create } from 'zustand'

const ACCESS_TOKEN = 'admin-token'

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
  window.location.href = '/sign-in'
}

export const useAuthStore = create<AuthState>()((set) => {
  const cookieState = Cookies.get(ACCESS_TOKEN)
  const initToken = cookieState || ''
  return {
    auth: {
      user: null,
      setUser: (user) =>
        set((state) => ({ ...state, auth: { ...state.auth, user } })),
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
          return {
            ...state,
            auth: { ...state.auth, user: null, accessToken: '' },
          }
        }),
    },
  }
})

// export const useAuth = () => useAuthStore((state) => state.auth)
