import ContentSection from "@/features/settings/components/content-section"
import CreatePlanForm from "../components/create-plan-form"

export default function CreatePlan() {
  return (
    <ContentSection title="Create Plan" desc="Create a new plan for your users." >
      <CreatePlanForm />
    </ContentSection>
  )
}
