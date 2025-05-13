
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Edit3, ShieldAlert } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const updateEmailSchema = z.object({
  newEmail: z.string().email({ message: "Please enter a valid email address." }),
  currentPasswordForEmail: z.string().min(1, { message: "Current password is required to change email." }),
});
type UpdateEmailValues = z.infer<typeof updateEmailSchema>;

const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "New passwords don't match.",
  path: ["confirmNewPassword"],
});
type UpdatePasswordValues = z.infer<typeof updatePasswordSchema>;


export function AccountSettingsSection() {
  const { toast } = useToast();

  const emailForm = useForm<UpdateEmailValues>({
    resolver: zodResolver(updateEmailSchema),
    defaultValues: { newEmail: "", currentPasswordForEmail: "" },
  });

  const passwordForm = useForm<UpdatePasswordValues>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const onUpdateEmailSubmit = (data: UpdateEmailValues) => {
    // Simulate API call
    console.log("Update email data:", data);
    toast({
      title: "Email Update Requested",
      description: `A confirmation link has been sent to ${data.newEmail} (simulated).`,
    });
    emailForm.reset();
  };

  const onUpdatePasswordSubmit = (data: UpdatePasswordValues) => {
    // Simulate API call
    console.log("Update password data:", data);
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully (simulated).",
    });
    passwordForm.reset();
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <Mail className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Change Email Address</CardTitle>
          </div>
          <CardDescription>Update the email address associated with your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onUpdateEmailSubmit)} className="space-y-6">
              <FormField
                control={emailForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Edit3 className="mr-2 h-4 w-4 text-muted-foreground" /> New Email Address
                    </FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.new.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="currentPasswordForEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Current Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                     <FormMessage />
                    <p className="text-xs text-muted-foreground mt-1">For security, please enter your current password.</p>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto">Update Email</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-lg">
        <CardHeader>
           <div className="flex items-center space-x-3 mb-2">
            <ShieldAlert className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Change Password</CardTitle>
          </div>
          <CardDescription>Choose a strong new password to keep your account secure.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onUpdatePasswordSubmit)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Lock className="mr-2 h-4 w-4 text-muted-foreground" /> Current Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                      <Edit3 className="mr-2 h-4 w-4 text-muted-foreground" /> New Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmNewPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center">
                     <Edit3 className="mr-2 h-4 w-4 text-muted-foreground" /> Confirm New Password
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full sm:w-auto">Update Password</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
