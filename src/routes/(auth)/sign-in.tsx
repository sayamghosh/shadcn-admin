import { createFileRoute, redirect } from '@tanstack/react-router'
import { useAuthStore } from '@/stores/authStore'
import SignIn from '@/features/auth/sign-in'

export const Route = createFileRoute('/(auth)/sign-in')({
  beforeLoad: () => {
    // Check if user is already authenticated
    const { accessToken } = useAuthStore.getState().auth
    if (accessToken && accessToken.trim() !== '') {
      // Redirect authenticated users to admin panel
      throw redirect({ to: '/' })
    }
  },
  component: SignIn,
})