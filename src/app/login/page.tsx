
"use client"; // Required for useRef and event handlers

import { useRef } from 'react';
import { LoginForm, type LoginFormActionHandles } from '@/components/auth/login-form';
import LoginLogo, { type LoginLogoHandles } from '@/components/auth/login-logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const loginLogoRef = useRef<LoginLogoHandles>(null);
  const loginFormRef = useRef<LoginFormActionHandles>(null); // If LoginForm needs to expose anything

  const handleEmailFocus = () => loginLogoRef.current?.handleInputFocus('email');
  const handleEmailBlur = () => loginLogoRef.current?.handleInputBlur('email');
  const handleEmailChange = (value: string) => loginLogoRef.current?.handleInputChange('email', value);

  const handlePasswordFocus = () => loginLogoRef.current?.handleInputFocus('password');
  const handlePasswordBlur = () => loginLogoRef.current?.handleInputBlur('password');
  // Password change usually doesn't trigger complex bear animations beyond covered eyes

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back!</CardTitle>
          <CardDescription>Log in to continue to VidShare.</CardDescription>
          <LoginLogo ref={loginLogoRef} />
        </CardHeader>
        <CardContent>
          <LoginForm
            ref={loginFormRef} // If needed by LoginPage in the future
            onEmailFocus={handleEmailFocus}
            onEmailBlur={handleEmailBlur}
            onEmailChange={handleEmailChange}
            onPasswordFocus={handlePasswordFocus}
            onPasswordBlur={handlePasswordBlur}
          />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
