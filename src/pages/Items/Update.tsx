import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AppContext, AppContextType } from "@/context/AppContext";
import { setFormErrors } from "@/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { mapKeys, snakeCase } from "lodash";
import { useContext, useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, { message: "The name field is required." }),
    description: z.string().min(1, { message: "The description field is required." }),
})

type FormSchema = z.infer<typeof formSchema>;

const Update: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { token, user } = useContext(AppContext) as AppContextType

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        }
    });

    const getItem = async () => {
        const res = await fetch(`/api/items/${id}`)
        const data = await res.json();
        if (res.ok) {
            if (data.item.user_id === user?.id) {
                navigate("/")
            }
            form.setValue("name", data.item.name)
            form.setValue("description", data.item.description)
        }
    }

    const handleUpdate: SubmitHandler<FormSchema> = async (data) => {
        const snakeCaseData: Record<string, any> = mapKeys(data, (_, key) => snakeCase(key));

        try {
            const res = await fetch(`/api/items/${id}`, {
                method: "PUT",
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
                navigate('/')
            }

        } catch (error) {
            console.error("Error submitting the form:", error);
        }
    }

    useEffect(() => {
        getItem()
    })

    return (
        <>
            <h1 className="title">Update your item</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-8">
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
                    <Button type="submit">Update</Button>
                </form>
            </Form>
        </>
    )
}

export default Update