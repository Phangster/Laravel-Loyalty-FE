import { zodResolver } from "@hookform/resolvers/zod"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { mapKeys, snakeCase } from 'lodash';

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext, AppContextType } from "@/context/AppContext";
import { setFormErrors } from "@/utils";

const formSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email address." }),
    password: z.string().min(6, { message: "Password must be at least 6 characters." }),
})

type FormSchema = z.infer<typeof formSchema>;

const Login: React.FC = () => {
    const { setToken } = useContext(AppContext) as AppContextType
    const navigate = useNavigate();

    const form = useForm<FormSchema>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit: SubmitHandler<FormSchema> = async (data) => {

        const snakeCaseData: Record<string, any> = mapKeys(data, (_, key) => snakeCase(key));

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(snakeCaseData),
            });

            const data = await res.json();

            if (data.errors) {
                setFormErrors(form.setError, data.errors)
            } else {
                localStorage.setItem('token', data.token);
                setToken(data.token);
                navigate("/")
            }
        } catch (error) {
            console.error("Error submitting the form:", error);
        }
    };

    return (
        <>
            <h1 className="title">Login to your account</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Email Field */}
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="john@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Password Field */}
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Login</Button>
                </form>
            </Form>
        </>
    )
}

export default Login;