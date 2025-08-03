import { useEffect, useState } from 'react'
import { BASE_URL } from '@/lib/urls'
import ContentSection from '@/features/settings/components/content-section'
import DataTable from '../components/data-table'

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

  async function fetchData() {
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
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <ContentSection
      title='Payment History'
      desc='View your payment history and manage your subscriptions.'
      fullWidth={true}
    >
      <DataTable data={plans} />
    </ContentSection>
  )
}
