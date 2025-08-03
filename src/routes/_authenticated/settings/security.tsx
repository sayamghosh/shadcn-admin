import { createFileRoute } from '@tanstack/react-router'
import SettingsChangePassword from '@/features/settings/security'

export const Route = createFileRoute('/_authenticated/settings/security')({
  component: SettingsChangePassword,
})


