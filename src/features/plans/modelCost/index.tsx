import { useState ,useEffect} from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { useAuthStore } from '@/stores/authStore'
import { BASE_URL } from '@/lib/urls'
import EditModelCostModal from './components/editModelCostModal'
import { Shimmer } from '@/components/ui/shimmer'

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
    const [isLoading, setIsLoading] = useState(true)

    async function fetchData() {
        setIsLoading(true)
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
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Add loading state check
    if (isLoading) {
        return (
            <Card className="w-full mx-auto h-fit">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 w-full">
                    <div className="flex-1">
                        <Shimmer width="w-48" height="h-7" className="mb-2" />
                        <Shimmer width="w-64" height="h-4" />
                    </div>
                    <Shimmer width="w-32" height="h-9" />
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Array.from({ length: 9 }).map((_, index) => (
                            <div key={index} className="flex justify-between items-center p-2 rounded-lg border">
                                <Shimmer width="w-32" height="h-4" />
                                <Shimmer width="w-16" height="h-4" />
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <Shimmer width="w-40" height="h-4" />
                    </div>
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
                    {data && Object.entries(data)
                        .filter(([key]) => !['_id', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt'].includes(key))
                        .map(([key, value]) => (
                            <div key={key} className="flex justify-between items-center p-2 rounded-lg border">
                                <span className="font-medium capitalize">
                                    {key.split(/(?=[A-Z])/).join(" ")}
                                </span>
                                <span className="text-muted-foreground font-mono">
                                    {String(value)} points
                                </span>
                            </div>
                        ))}
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                    {data && <p>Last updated: {new Date(data.updatedAt).toLocaleDateString()}</p>}
                </div>
            </CardContent>
        </Card>
        </>
    )
}