
"use client"; 

import { useRef, useState } from 'react';
import { LoginForm, type LoginFormActionHandles } from '@/components/auth/login-form';
import LoginLogo, { type LoginLogoHandles } from '@/components/auth/login-logo';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function LoginPage() {
  const loginLogoRef = useRef<LoginLogoHandles>(null);
  const loginFormRef = useRef<LoginFormActionHandles>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Tracks actual password visibility state
  const [isPasswordFocused, setIsPasswordFocused] = useState(false); // Tracks if password field has focus

  const handleEmailFocus = () => loginLogoRef.current?.handleInputFocus('email');
  const handleEmailBlur = () => loginLogoRef.current?.handleInputBlur('email');
  const handleEmailChange = (value: string) => loginLogoRef.current?.handleInputChange('email', value);

  const handlePasswordFocus = () => {
    setIsPasswordFocused(true);
    if (isPasswordVisible) {
      loginLogoRef.current?.peek();
    } else {
      loginLogoRef.current?.coverEyes();
    }
  };
  
  const handlePasswordBlur = () => {
    setIsPasswordFocused(false);
    // Only uncover eyes if password is not visible. If visible, peeking state might persist until next focus/blur.
    // Or, always uncover on blur. Let's go with always uncover for simplicity on blur.
    loginLogoRef.current?.uncoverEyes();
  };

  // Called from LoginForm when the visibility icon is clicked
  const handlePasswordVisibilityChange = (newVisibilityState: boolean) => {
    setIsPasswordVisible(newVisibilityState);
    if (isPasswordFocused) { // Only change animation if the field is currently focused
      if (newVisibilityState) {
        loginLogoRef.current?.peek(); // Password shown, field focused: Bear peeks
      } else {
        loginLogoRef.current?.coverEyes(); // Password hidden, field focused: Bear covers eyes
      }
    }
    // If not focused, the blur handler (uncoverEyes) or next focus handler will set the correct state.
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
            onPasswordVisibilityChange={handlePasswordVisibilityChange}
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

    