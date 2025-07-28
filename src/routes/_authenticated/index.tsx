import { createFileRoute ,redirect} from '@tanstack/react-router'
import Dashboard from '@/features/dashboard'
import { useAuthStore } from '@/stores/authStore'

export const Route = createFileRoute('/_authenticated/')({
  beforeLoad: () => {
      // Check if user is already authenticated
      const { accessToken } = useAuthStore.getState().auth
      if (!accessToken && accessToken.trim() == '') {
        // Redirect authenticated users to admin panel
        throw redirect({ to: '/sign-in' })
      }
    },
  component: Dashboard,
})
