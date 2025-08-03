import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { BASE_URL } from "@/lib/urls";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/authStore";

export default function CreatePlanForm() {
    const formSchema = z.object({
        name: z.string().min(1, "Plan name is required"),
        description: z.string(),
        planType: z.string().min(1, "Plan type is required"),
        planDurationType: z.string("Plan duration type is required"),
        priceInINR: z.number().min(0, "Price in INR must be a positive number"),
        priceInUSD: z.number().min(0, "Price in USD must be a positive number"),
        points: z.number().min(0, "Points must be a positive number"),
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            planType: "",
            planDurationType: "",
        },
    });

    const { accessToken } = useAuthStore((state) => state.auth);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {
           const res = await fetch(`${BASE_URL}/api/payments/create-subscription-plans`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${accessToken}`,
            },
            body: JSON.stringify(data),
           }
        )
        const response = await res.json();
        if(response.error){
            toast.error("error in creating plan",{duration: 5000});
        }
        else{
            toast.success("Plan created successfully",{duration: 5000});
            form.reset();
        }

        } catch (error) {
            // eslint-disable-next-line no-console
            console.error("Error creating plan:", error);
        }
        
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='Enter the plan name'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='description'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    placeholder='Enter a brief description of the plan'
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='planType'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plan Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select plan type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="wallet">Wallet</SelectItem>
                                    <SelectItem value="subscription">Subscription</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='planDurationType'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Plan Duration Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="monthly">Monthly</SelectItem>
                                    <SelectItem value="yearly">Yearly</SelectItem>
                                    <SelectItem value="lifetime">Lifetime</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='priceInINR'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price in INR</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Enter price in INR'
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='priceInUSD'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Price in USD</FormLabel>
                            <FormControl>
                                <Input
                                    type='number'
                                    placeholder='Enter price in USD'
                                    {...field}
                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                                    placeholder='Enter points'
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type='submit'>Submit</Button>
            </form>
        </Form>
    )
}
