import { createFileRoute } from '@tanstack/react-router'
import ModelCost from '@/features/plans/modelCost'

export const Route = createFileRoute('/_authenticated/plans/module-cost')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
      <ModelCost />
  )
}
