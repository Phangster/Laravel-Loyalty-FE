import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AppContext, AppContextType } from "@/context/AppContext"
import { setFormErrors } from "@/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { mapKeys, snakeCase } from "lodash"
import { ReactNode, useContext, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { Input } from "@/components/ui/input";

interface CreateRewardProps {
    children: ReactNode
}

const formSchema = z.object({
    name: z.string().min(1, { message: "The name field is required." }),
    description: z.string().min(1, { message: "The description field is required." }),
    points_required: z.number().min(1, { message: "The points required must be at least 1." }),
    stock_quantity: z.number().min(1, { message: "The stock quantity must be at least 1." }),
})

type FormSchema = z.infer<typeof formSchema>;

const CreateReward: React.FC<CreateRewardProps> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const { token } = useContext(AppContext) as AppContextType

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            points_required: 0,
            stock_quantity: 0,
        }
    });

    const onSubmit: SubmitHandler<FormSchema> = async (data) => {
        const snakeCaseData: Record<string, any> = mapKeys(data, (_, key) => snakeCase(key));

        try {
            const res = await fetch("/api/rewards", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(snakeCaseData),
            });

            const data = await res.json();

            if (data.errors) {
                setFormErrors(form.setError, data.errors)
            } else {
                setOpen(false)
            }

        } catch (error) {
            console.error("Error submitting the form:", error);
        }
    }

    return (
        <Dialog open={open} onOpenChange={() => setOpen(!open)}>
            <DialogTrigger asChild >
                <Button onClick={() => setOpen(!open)}>{children}</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader className="flex flex-col gap-y-4">
                    <DialogTitle>
                        <h1>Create your reward</h1>
                    </DialogTitle>
                    <DialogDescription>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                {/* Name */}
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Cheese Burger" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Description */}
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Very cheesy beef burger" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Points Required */}
                                <FormField
                                    control={form.control}
                                    name="points_required"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Points Required</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                {/* Stock Quantity */}
                                <FormField
                                    control={form.control}
                                    name="stock_quantity"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Stock Quantity</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit">Create</Button>
                            </form>
                        </Form>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CreateReward
