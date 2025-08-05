import { useState ,useEffect} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useAuthStore } from '@/stores/authStore'
import { BASE_URL } from '@/lib/urls'
import EditModelCostModal from './components/editModelCostModal'

interface ModelCostData {
  _id: string
  rebuildingOfSkillDriftProfile: number
  jobMatchAnalysis: number
  aspirationsReading: number
  tailorResume: number
  interviewPreparation: number
  resumeImprovement: number
  quizWhenCompletingTheRoadmapItem: number
  reanalysisOfSkills: number
  resumeDownload: number
  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
}

export default function ModelCost() {
    const { accessToken } = useAuthStore((state) => state.auth)
    const [data, setdata] = useState<ModelCostData | null>(null) // Add null type
    const [isOpen, setIsOpen] = useState(false)

    async function fetchData() {
        try {
            const res = await fetch(`${BASE_URL}/api/payments/get-module-costs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            })
            const response = await res.json()
            if(response.status) {
                setdata(response.data)
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error fetching model costs:', error)
        }
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Add loading state check
    if (!data) {
        return (
            <Card className="w-full mx-auto">
                <CardHeader>
                    <CardTitle>Loading...</CardTitle>
                </CardHeader>
                <CardContent>
                    <p>Fetching model costs...</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
        <EditModelCostModal open={isOpen} onOpenChange={setIsOpen} data={data} onSuccess={()=>fetchData()}/>
        <Card className="w-full mx-auto h-fit">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 w-full">
                <div>
                    <CardTitle className="text-2xl font-bold">Model Costs</CardTitle>
                    <CardDescription>Manage your model cost configuration</CardDescription>
                </div>
                <Button variant="ghost" size='default' className=" flex" onClick={() => setIsOpen(true)}>
                    <p>Edit Model Cost</p>
                    <Edit className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(data)
                        .filter(([key]) => !['_id', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt'].includes(key))
                        .map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-2 rounded-lg border">
                                <span className="font-medium capitalize">
                                    {key.split(/(?=[A-Z])/).join(" ")}
                                </span>
                                <span className="text-muted-foreground font-mono">
                                    {value} points
                                </span>
                            </div>
                        ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    <p>Last updated: {new Date(data.updatedAt).toLocaleDateString()}</p>
                </div>
            </CardContent>
        </Card>
        </>
    )
}