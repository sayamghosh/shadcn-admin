import { useEffect, useState } from 'react'
import { BASE_URL } from '@/lib/urls'
import ContentSection from '@/features/settings/components/content-section'
import DataTable from '../components/data-table'
import EditPlanModal from '../components/edit-plan-modal'

export type Payment = {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

interface Plan {
  _id: string;
  name: string;
  description: string;
  planType: string;           // or more specific: "wallet"
  planDurationType: string;   // or more specific: "lifetime"
  priceInINR: number;
  priceInUSD: number;
  points: number;
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
};

export default function ViewPlans() {

  const [plans, setPlans] = useState<Plan[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function fetchData() {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${BASE_URL}/api/payments/get-subscription-plans`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      const response = await res.json()
      setPlans(response.data || [])
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching subscription plans:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()

    // Listen for edit plan events
    const handleEditPlan = (event: CustomEvent<Plan>) => {
      setSelectedPlan(event.detail)
      setEditModalOpen(true)
    }

    window.addEventListener('editPlan', handleEditPlan as EventListener)
    return () => window.removeEventListener('editPlan', handleEditPlan as EventListener)
  }, [])

  return (
    <>
      <ContentSection
        title='Plans'
        desc='View and manage your subscription plans.'
        fullWidth={true}
      >
        <DataTable data={plans} loading={isLoading} />
      </ContentSection>
      
      <EditPlanModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        plan={selectedPlan}
        onSuccess={() => {
          fetchData() // Refresh the data after successful edit
        }}
      />
    </>
  )
}
