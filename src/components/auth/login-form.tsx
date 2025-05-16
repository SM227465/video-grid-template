
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import React, { forwardRef, useImperativeHandle } from 'react'; // Added forwardRef and useImperativeHandle
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn as LogInIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const loginFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

interface LoginFormProps {
  onEmailFocus?: () => void;
  onEmailBlur?: () => void;
  onEmailChange?: (value: string) => void;
  onPasswordFocus?: () => void;
  onPasswordBlur?: () => void;
}

// If LoginForm needs to expose any methods to its parent (LoginPage)
export interface LoginFormActionHandles {
  // Example: clearForm: () => void;
}

export const LoginForm = forwardRef<LoginFormActionHandles, LoginFormProps>(
  ({ onEmailFocus, onEmailBlur, onEmailChange, onPasswordFocus, onPasswordBlur }, ref) => {
    const { setUserRole } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const form = useForm<LoginFormValues>({
      resolver: zodResolver(loginFormSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    // Expose any imperative handles if needed by parent
    useImperativeHandle(ref, () => ({
      // clearForm: () => form.reset(),
    }));

    const onSubmit = (data: LoginFormValues) => {
      const username = data.email.split('@')[0];
      setUserRole("free_user", username);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${username}!`,
      });
      router.push("/");
    };

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="your@email.com"
                    {...field}
                    onFocus={onEmailFocus}
                    onBlur={onEmailBlur}
                    onChange={(e) => {
                      field.onChange(e);
                      onEmailChange?.(e.target.value);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Password
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    {...field}
                    onFocus={onPasswordFocus}
                    onBlur={onPasswordBlur}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            <LogInIcon className="mr-2 h-4 w-4" /> Login
          </Button>
        </form>
      </Form>
    );
  }
);

LoginForm.displayName = "LoginForm";
