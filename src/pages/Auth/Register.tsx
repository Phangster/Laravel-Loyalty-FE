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

const formSchema = z.object({
  name: z.string().min(1, { message: "Name must not be empty" }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  passwordConfirmation: z.string().min(6, { message: "Please confirm your password." })
}).refine((data) => data.password === data.passwordConfirmation, {
  message: "Passwords don't match",
  path: ["passwordConfirmation"],
});

type FormSchema = z.infer<typeof formSchema>;

const Register: React.FC = () => {
  const { setToken } = useContext(AppContext) as AppContextType
  const navigate = useNavigate();

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: ""
    }
  });

  const onSubmit: SubmitHandler<FormSchema> = async (data) => {

    const snakeCaseData: Record<string, any> = mapKeys(data, (_, key) => snakeCase(key));

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(snakeCaseData),
      });

      const responseData = await res.json();

      // TODO Handle errors from BE to form as well, current the form validates the error
      if (responseData.errors) {
        console.log('error', responseData.errors);
      } else {
        localStorage.setItem('token', responseData.token);
        setToken(responseData.token);
        navigate("/")
        console.log('success', responseData);
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  return (
    <>
      <h1 className="title">Register a new account</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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

          {/* Confirm Password Field */}
          <FormField
            control={form.control}
            name="passwordConfirmation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="******" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Register</Button>
        </form>
      </Form>
    </>
  )
}

export default Register;