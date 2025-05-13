
"use client";

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldCheck, Crown, Zap, CheckCircle, XCircle, Briefcase } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
// import { initiateUPIPayment, UPIPaymentStatus } from '@/services/upi-payment'; // Not needed here anymore

export function SubscriptionSection() {
  const { userRole, userName, setUserRole } = useAuth(); // setUserRole might not be needed if upgrade happens on /plans
  const router = useRouter();
  const { toast } = useToast();

  // Mock data - in a real app, this would come from an API
  const subscriptionDetails = {
    free_user: {
      planName: "Free Plan",
      status: "Active",
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
      price: "$0/month",
    },
    paid_user: {
      planName: "Premium Plan",
      status: "Active",
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(), // Approx. 30 days from now
      renewalPrice: "$9.99/month", // Example price
      features: [
        { name: "Access to entire video library", included: true },
        { name: "HD/4K quality streaming", included: true },
        { name: "Personalized recommendations", included: true },
        { name: "Ad-free experience", included: true },
        { name: "Download videos for offline viewing", included: true },
        { name: "Early access to new content", included: true },
        { name: "Priority support", included: true },
      ],
      price: "$9.99/month", // Example price
    },
  };

  const currentPlan = userRole === "guest" ? null : subscriptionDetails[userRole];

  const handleNavigateToPlans = () => {
    router.push('/plans');
  };

  if (userRole === "guest") {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex items-center space-x-3 mb-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Subscription Status</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">Log in or sign up to manage your subscription.</p>
          <Button onClick={() => router.push('/login?redirect=/profile?tab=subscription')}>Login to View Subscription</Button>
        </CardContent>
      </Card>
    );
  }


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-3 mb-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <CardTitle className="text-2xl">Subscription Details</CardTitle>
        </div>
        <CardDescription>Manage your VidShare plan and billing information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {currentPlan && (
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              {userRole === "paid_user" ? <Crown className="w-5 h-5 mr-2 text-yellow-500" /> : <Zap className="w-5 h-5 mr-2 text-blue-500" />}
              Your Current Plan: {currentPlan.planName}
            </h3>
            <p className="text-muted-foreground">Status: <span className="font-medium text-green-600">{currentPlan.status}</span></p>
            {userRole === "paid_user" && currentPlan.nextBillingDate && (
              <>
                <p className="text-muted-foreground">Next Billing Date: <span className="font-medium">{currentPlan.nextBillingDate}</span></p>
                <p className="text-muted-foreground">Renewal Price: <span className="font-medium">{currentPlan.renewalPrice}</span></p>
              </>
            )}

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">Plan Features:</h4>
              <ul className="space-y-2">
                {currentPlan.features.map(feature => (
                  <li key={feature.name} className="flex items-center text-sm">
                    {feature.included ? (
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-2 text-destructive/70 shrink-0" />
                    )}
                    <span className={!feature.included ? 'text-muted-foreground line-through' : ''}>
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {userRole === "free_user" && (
          <div className="mt-8 p-6 bg-primary/10 rounded-lg text-center">
            <h4 className="text-xl font-semibold mb-2 text-primary flex items-center justify-center">
              <Crown className="w-6 h-6 mr-2 text-yellow-500" />
              Upgrade to Premium!
            </h4>
            <p className="text-muted-foreground mb-4">Unlock ad-free viewing, HD/4K streaming, downloads, and more exclusive content.</p>
            <Button onClick={handleNavigateToPlans} size="lg">
              View Premium Plans
            </Button>
          </div>
        )}
        {userRole === "paid_user" && (
           <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => toast({title: "Not Implemented", description: "Managing payment methods is not yet available."})}>
              Manage Payment Methods
            </Button>
             <Button variant="outline" onClick={handleNavigateToPlans}>
                <Briefcase className="mr-2 h-4 w-4" />
                View All Plans
            </Button>
            <Button variant="destructive" onClick={() => toast({title: "Not Implemented", description: "Cancelling subscription is not yet available."})}>
              Cancel Subscription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
