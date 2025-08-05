import { useEffect, useState } from 'react'
import { BASE_URL } from '@/lib/urls'
import ContentSection from '@/features/settings/components/content-section'
import EditPlanModal from '../components/edit-plan-modal'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Calendar, DollarSign, Coins } from 'lucide-react'

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

  const handleEditPlan = (plan: Plan) => {
    setSelectedPlan(plan)
    setEditModalOpen(true)
  }

  const getPlanTypeVariant = (planType: string) => {
    switch (planType.toLowerCase()) {
      case 'wallet':
        return 'default'
      case 'subscription':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getDurationVariant = (durationType: string) => {
    switch (durationType.toLowerCase()) {
      case 'lifetime':
        return 'destructive'
      case 'yearly':
        return 'default'
      case 'monthly':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  return (
    <>
      <ContentSection
        title='Plans'
        desc='View and manage your subscription plans.'
        fullWidth={true}
      >
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                    <div className="h-4 bg-gray-200 rounded dark:bg-gray-700"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : plans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan._id} className="relative group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold mb-2">
                        {plan.name}
                      </CardTitle>
                      <CardDescription className="text-sm text-muted-foreground">
                        {plan.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 transition-opacity"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Badge variant={getPlanTypeVariant(plan.planType)}>
                      {plan.planType}
                    </Badge>
                    <Badge variant={getDurationVariant(plan.planDurationType)}>
                      {plan.planDurationType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Price (INR)</span>
                      </div>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(plan.priceInINR)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Price (USD)</span>
                      </div>
                      <span className="font-medium">
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(plan.priceInUSD)}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm text-muted-foreground">Points</span>
                      </div>
                      <span className="font-medium">{plan.points.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-xs text-muted-foreground">Created</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(plan.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center gap-2">
                <div className="h-12 w-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="font-semibold">No plans found</h3>
                <p className="text-sm text-muted-foreground">
                  Create your first subscription plan to get started.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
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
