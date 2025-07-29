import z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

import { useAuthStore } from '@/stores/authStore'

export default function ChangePasswordForm() {
  const formSchema = z
    .object({
      oldPassword: z
        .string()
        .min(1, 'Please enter your password')
        .min(6, 'Password must be at least 6 characters long'),
      newPassword: z
        .string()
        .min(1, 'Please enter your new password')
        .min(6, 'New password must be at least 6 characters long'),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match',
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },
  })

    const { accessToken } = useAuthStore((state) => state.auth)

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
        const res = await fetch("https://apidev.skilldrift.ai/api/admins/change-password",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(
            {
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            }
        ),
        })
        const response = await res.json()
        if(response.status){
            // Handle successful password change
            toast.success('Password changed successfully!')
            form.reset()
        }
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log('Error changing password:', error)
        toast.error('Failed to change password. Please try again.')
    }   
  }

  const {handleSubmit,formState:{isSubmitting}} = form

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-8' >
        <FormField
            control={form.control}
            name='oldPassword'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Old Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your old password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
        />
        <FormField
          control={form.control}
          name='newPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Enter your new password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type='password'
                  placeholder='Confirm your new password'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={isSubmitting}>Submit</Button>
        
      </form>
    </Form>
  )
}
