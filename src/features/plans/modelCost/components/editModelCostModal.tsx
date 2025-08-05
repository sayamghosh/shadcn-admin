import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { BASE_URL } from '@/lib/urls'
import { useAuthStore } from '@/stores/authStore'
import { toast } from 'sonner'

interface ModelCostData {
  _id?: string
  rebuildingOfSkillDriftProfile: number
  jobMatchAnalysis: number
  aspirationsReading: number
  tailorResume: number
  interviewPreparation: number
  resumeImprovement: number
  quizWhenCompletingTheRoadmapItem: number
  reanalysisOfSkills: number
  resumeDownload: number
}

interface EditModelCostModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: ModelCostData | null
  onSuccess?: () => void
}

const formSchema = z.object({
  rebuildingOfSkillDriftProfile: z.number().min(0, "Value must be 0 or greater"),
  jobMatchAnalysis: z.number().min(0, "Value must be 0 or greater"),
  aspirationsReading: z.number().min(0, "Value must be 0 or greater"),
  tailorResume: z.number().min(0, "Value must be 0 or greater"),
  interviewPreparation: z.number().min(0, "Value must be 0 or greater"),
  resumeImprovement: z.number().min(0, "Value must be 0 or greater"),
  quizWhenCompletingTheRoadmapItem: z.number().min(0, "Value must be 0 or greater"),
  reanalysisOfSkills: z.number().min(0, "Value must be 0 or greater"),
  resumeDownload: z.number().min(0, "Value must be 0 or greater"),
})

type FormData = z.infer<typeof formSchema>

export default function EditModelCostModal({ open, onOpenChange, data ,onSuccess}: EditModelCostModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { accessToken } = useAuthStore((state) => state.auth)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rebuildingOfSkillDriftProfile: 0,
      jobMatchAnalysis: 0,
      aspirationsReading: 0,
      tailorResume: 0,
      interviewPreparation: 0,
      resumeImprovement: 0,
      quizWhenCompletingTheRoadmapItem: 0,
      reanalysisOfSkills: 0,
      resumeDownload: 0,
    },
  })

  // Reset form when data changes
  useEffect(() => {
    if (data) {
      form.reset({
        rebuildingOfSkillDriftProfile: data.rebuildingOfSkillDriftProfile,
        jobMatchAnalysis: data.jobMatchAnalysis,
        aspirationsReading: data.aspirationsReading,
        tailorResume: data.tailorResume,
        interviewPreparation: data.interviewPreparation,
        resumeImprovement: data.resumeImprovement,
        quizWhenCompletingTheRoadmapItem: data.quizWhenCompletingTheRoadmapItem,
        reanalysisOfSkills: data.reanalysisOfSkills,
        resumeDownload: data.resumeDownload,
      })
    }
  }, [data, form])

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetch(`${BASE_URL}/api/payments/update-module-cost/${data?._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(values),
      })

      if (response.ok) {
        onOpenChange(false)
        onSuccess?.()
        toast.success('Model costs updated successfully!', { duration: 3000 })
        form.reset()
      } else {
        const errorData = await response.json()
        // Handle error - you can add toast notification here
        alert('Error updating model costs: ' + (errorData.message || 'Unknown error'))
      }
    } catch (error) {
      // Handle error - you can add toast notification here
      alert('Error updating model costs: ' + (error instanceof Error ? error.message : 'Unknown error'))
    } finally {
      setIsSubmitting(false)
    }
  }

  const fieldLabels = {
    rebuildingOfSkillDriftProfile: "Rebuilding of Skill Drift Profile",
    jobMatchAnalysis: "Job Match Analysis",
    aspirationsReading: "Aspirations Reading",
    tailorResume: "Tailor Resume",
    interviewPreparation: "Interview Preparation",
    resumeImprovement: "Resume Improvement",
    quizWhenCompletingTheRoadmapItem: "Quiz When Completing Roadmap Item",
    reanalysisOfSkills: "Reanalysis of Skills",
    resumeDownload: "Resume Download",
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Model Costs</DialogTitle>
          <DialogDescription>
            Update the point costs for different model operations. All values must be 0 or greater.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(fieldLabels).map(([fieldName, label]) => (
                <FormField
                  key={fieldName}
                  control={form.control}
                  name={fieldName as keyof FormData}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{label}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          placeholder="0"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
