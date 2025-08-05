import { createFileRoute } from '@tanstack/react-router'
import ForceRecharge from '@/features/plans/forceRecharge'

export const Route = createFileRoute('/_authenticated/plans/force-recharge')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <ForceRecharge />
  )
}
