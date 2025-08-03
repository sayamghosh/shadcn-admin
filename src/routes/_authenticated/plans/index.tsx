import ViewPlans from '@/features/plans/viewPlans'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/plans/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ViewPlans />
  )
}
