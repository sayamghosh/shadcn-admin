import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form"
import z from "zod"
import { useAuthStore } from "@/stores/authStore";
import { toast } from "sonner";
import { BASE_URL } from "@/lib/urls";

export default function ForceRechargeForm () {

    const { accessToken } = useAuthStore((state) => state.auth);

    const formSchema = z.object({
        user:z.string("Please enter the user Id"),
        points:z.number().min(1,"Number ")
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver:zodResolver(formSchema)
    })

    const {formState:{isSubmitting}} = form

    async function onSubmit(data: z.infer<typeof formSchema>) {
        try {
            const res = await fetch(`${BASE_URL}/api/payments/recharge-wallet`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(data),
            });

            const response = await res.json();
            if (response.error) {
                toast.error("Error during force recharge", { duration: 5000 });
            } else {
                
                toast.success("Force recharge successful", { duration: 5000 });
                form.reset();
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error during force recharge:", error);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='user'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>User Id</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='Enter the user Id'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='points'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Points</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Enter the number of points to recharge'
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit' disabled={isSubmitting}>Recharge</Button>
            </form>
        </Form>
    );
}