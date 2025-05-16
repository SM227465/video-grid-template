
"use client"; // Required for useRef and event handlers

import { useRef, useState } from 'react'; // Added useState
import { LoginForm, type LoginFormActionHandles } from '@/components/auth/login-form';
import LoginLogo, { type LoginLogoHandles } from '@/components/auth/login-logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const loginLogoRef = useRef<LoginLogoHandles>(null);
  const loginFormRef = useRef<LoginFormActionHandles>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);


  const handleEmailFocus = () => loginLogoRef.current?.handleInputFocus('email');
  const handleEmailBlur = () => loginLogoRef.current?.handleInputBlur('email');
  const handleEmailChange = (value: string) => loginLogoRef.current?.handleInputChange('email', value);

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    if (!isPasswordVisible) {
      loginLogoRef.current?.handleInputFocus('password'); // This internally calls coverEyes
    }
  };
  
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    loginLogoRef.current?.handleInputBlur('password'); // This internally calls uncoverEyes
  };

  const handlePasswordVisibilityChange = (isVisible: boolean) => {
    setIsPasswordVisible(isVisible);
    if (isVisible) {
      loginLogoRef.current?.uncoverEyes(); // Explicitly uncover if password becomes visible
    } else {
      // If password becomes hidden AND the field is still focused
      if (isPasswordFocused) {
         loginLogoRef.current?.coverEyes();
      }
    }
  };

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
            ref={loginFormRef}
            onEmailFocus={handleEmailFocus}
            onEmailBlur={handleEmailBlur}
            onEmailChange={handleEmailChange}
            onPasswordFocus={handlePasswordFocus}
            onPasswordBlur={handlePasswordBlur}
            onPasswordVisibilityChange={handlePasswordVisibilityChange} // Pass the new handler
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
