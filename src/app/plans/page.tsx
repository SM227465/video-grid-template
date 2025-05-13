
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { initiateUPIPayment, UPIPaymentStatus, UPIDetails } from '@/services/upi-payment';
import { Check, X, Star, Crown, Zap, QrCode as QrCodeIcon } from "lucide-react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface Plan {
  id: string;
  name: string;
  price: string;
  billingCycle?: string;
  description: string;
  features: PlanFeature[];
  icon: React.ElementType;
  isPopular?: boolean;
  ctaText: string;
  upgradeRole?: "paid_user"; // Role to set upon successful subscription
  paymentAmount?: number; // Amount in smallest currency unit (e.g., paise for INR)
}

const plans: Plan[] = [
  {
    id: "free",
    name: "Basic",
    price: "Free",
    description: "Get started with our basic features.",
    icon: Zap,
    features: [
      { name: "Access to standard video library", included: true },
      { name: "SD quality streaming", included: true },
      { name: "Limited recommendations", included: true },
      { name: "Ad-supported", included: true },
      { name: "HD/4K streaming", included: false },
      { name: "Ad-free experience", included: false },
      { name: "Download videos", included: false },
      { name: "Early access to new content", included: false },
    ],
    ctaText: "Current Plan",
  },
  {
    id: "monthly_premium",
    name: "Premium Monthly",
    price: "₹299",
    billingCycle: "/month",
    description: "Unlock all premium features with our monthly plan.",
    icon: Star,
    isPopular: true,
    features: [
      { name: "Access to entire video library", included: true },
      { name: "HD/4K quality streaming", included: true },
      { name: "Personalized recommendations", included: true },
      { name: "Ad-free experience", included: true },
      { name: "Download videos for offline viewing", included: true },
      { name: "Early access to new content", included: true },
      { name: "Priority support", included: true },
    ],
    ctaText: "Choose Monthly",
    upgradeRole: "paid_user",
    paymentAmount: 29900, // Assuming ₹299.00
  },
  {
    id: "yearly_premium",
    name: "Premium Yearly",
    price: "₹2999",
    billingCycle: "/year",
    description: "Save big with our annual premium subscription.",
    icon: Crown,
    features: [
      { name: "Access to entire video library", included: true },
      { name: "HD/4K quality streaming", included: true },
      { name: "Personalized recommendations", included: true },
      { name: "Ad-free experience", included: true },
      { name: "Download videos for offline viewing", included: true },
      { name: "Early access to new content", included: true },
      { name: "Priority support", included: true },
      { name: "Exclusive yearly badge", included: true },
    ],
    ctaText: "Choose Yearly",
    upgradeRole: "paid_user",
    paymentAmount: 299900, // Assuming ₹2999.00
  },
];

export default function PlansPage() {
  const { userRole, userName, setUserRole, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null); // Store ID of plan being processed

  const handleSubscribe = async (plan: Plan) => {
    if (!isAuthenticated) {
        toast({
            title: "Authentication Required",
            description: "Please log in or sign up to subscribe.",
            variant: "destructive",
        });
        router.push('/login?redirect=/plans');
        return;
    }

    if (!plan.upgradeRole || !plan.paymentAmount) return;

    setIsLoading(plan.id);
    try {
      const paymentDetails: UPIDetails = {
        upiId: "vidshare@exampleupi", // This is a mock UPI ID for Razorpay simulation
        recipientName: "VidShare Subscriptions",
        amount: plan.paymentAmount / 100, // Convert from paise to rupees for the service
        notes: `VidShare Subscription - ${plan.name}`,
      };
      
      toast({ title: "Processing Payment...", description: `Initiating UPI payment for ${plan.name}.` });
      const result = await initiateUPIPayment(paymentDetails);

      if (result.status === UPIPaymentStatus.SUCCESS) {
        setUserRole(plan.upgradeRole, userName);
        toast({ title: "Payment Successful!", description: `Welcome to ${plan.name}!` });
        router.push('/profile?tab=subscription'); // Navigate to subscription status
      } else {
        toast({ variant: "destructive", title: "Payment Failed", description: result.message || "Unable to process payment. Please try again." });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({ variant: "destructive", title: "Payment Error", description: "An unexpected error occurred during payment." });
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose Your Plan</h1>
        <p className="mt-3 text-lg text-muted-foreground sm:mt-5">
          Unlock more features by subscribing to one of our tailored plans.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 items-stretch">
        {plans.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col rounded-xl shadow-lg transition-all hover:shadow-2xl ${plan.isPopular ? 'border-primary border-2 relative ring-2 ring-primary ring-offset-2' : 'border'}`}
          >
            {plan.isPopular && (
              <div className="absolute -top-3 -right-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-md">
                Popular
              </div>
            )}
            <CardHeader className="p-6 text-center">
              <plan.icon className={`w-12 h-12 mx-auto mb-4 ${plan.isPopular ? 'text-primary' : 'text-muted-foreground'}`} />
              <CardTitle className="text-2xl font-semibold">{plan.name}</CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">{plan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.billingCycle && <span className="text-muted-foreground">{plan.billingCycle}</span>}
              </div>
            </CardHeader>
            <CardContent className="p-6 flex-grow">
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    {feature.included ? (
                      <Check className="w-5 h-5 mr-2 text-green-500 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 mr-2 text-red-500 shrink-0 mt-0.5" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground' : ''}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
              {plan.id !== 'free' && plan.paymentAmount && (
                <div className="mt-6 pt-6 border-t border-dashed">
                  <p className="text-sm text-center text-muted-foreground mb-2">Pay with any UPI app:</p>
                  <div className="p-4 border border-dashed rounded-md text-center bg-muted/30">
                    <QrCodeIcon data-ai-hint="QR code" className="mx-auto mb-2 h-24 w-24 text-foreground" />
                    <p className="text-xs text-muted-foreground">Scan this QR code or click the button below.</p>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="p-6 mt-auto">
              <Button
                className="w-full text-lg py-3"
                size="lg"
                onClick={() => handleSubscribe(plan)}
                disabled={
                  isLoading === plan.id || 
                  (plan.id === "free" && userRole === "free_user") || 
                  (plan.upgradeRole === "paid_user" && userRole === "paid_user")
                }
                variant={plan.isPopular ? 'default' : 'outline'}
              >
                {isLoading === plan.id ? "Processing..." : 
                 (plan.id === "free" && userRole === "free_user") ? "Current Plan" : 
                 (plan.upgradeRole === "paid_user" && userRole === "paid_user") ? "Subscribed" : 
                 plan.ctaText
                }
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       <div className="mt-12 text-center">
        <p className="text-muted-foreground">
          Have questions? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
        </p>
      </div>
    </div>
  );
}

