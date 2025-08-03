import { createFileRoute } from '@tanstack/react-router'
import CreatePlan from '@/features/plans/createPlans'

export const Route = createFileRoute('/_authenticated/plans/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreatePlan />
}
