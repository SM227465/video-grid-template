
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UserCircle, ShieldCheck, History, Settings as SettingsIcon, CreditCard } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/use-auth';
import { UserInfoSection } from '@/components/profile/user-info-section';
import { AccountSettingsSection } from '@/components/profile/account-settings-section';
import { SubscriptionSection } from '@/components/profile/subscription-section';
import { WatchHistorySection } from '@/components/profile/watch-history-section';
import { PaymentHistorySection } from '@/components/profile/payment-history-section';
import { Button } from '@/components/ui/button';

type TabValue = "profile" | "settings" | "subscription" | "history" | "payments";

const tabConfig: { value: TabValue; label: string; icon: React.ElementType }[] = [
  { value: "profile", label: "My Profile", icon: UserCircle },
  { value: "settings", label: "Account Settings", icon: SettingsIcon },
  { value: "subscription", label: "Subscription", icon: ShieldCheck },
  { value: "history", label: "Watch History", icon: History },
  { value: "payments", label: "Payment History", icon: CreditCard },
];

export default function ProfilePage() {
  const { isAuthenticated, userRole, userName } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') as TabValue | null;
  
  const [activeTab, setActiveTab] = useState<TabValue>(initialTab || "profile");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    const tabFromQuery = searchParams.get('tab') as TabValue | null;
    if (tabFromQuery && tabConfig.find(t => t.value === tabFromQuery)) {
      setActiveTab(tabFromQuery);
    } else if (!tabFromQuery) {
      // If no tab in query, set to 'profile' and update URL
      setActiveTab("profile");
       router.replace('/profile?tab=profile', { scroll: false });
    }
  }, [searchParams, router]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabValue;
    setActiveTab(newTab);
    router.push(`/profile?tab=${newTab}`, { scroll: false });
  };

  if (!isAuthenticated) {
    // Optional: Show a loading state or redirect immediately
    return <div className="flex items-center justify-center h-full"><p>Loading...</p></div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Your Account</h1>
          <p className="text-muted-foreground">Manage your profile, settings, and subscription.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6">
          {tabConfig.map(tab => {
            if (tab.value === "subscription" && userRole !== "paid_user" && userRole !== "free_user") return null; // Hide for guest, show for free to allow upgrade
            if (tab.value === "payments" && userRole !== "paid_user") return null; // Only for paid users
             return (
              <TabsTrigger key={tab.value} value={tab.value} className="flex-col sm:flex-row sm:gap-2 h-auto py-2 sm:py-1.5">
                <tab.icon className="h-5 w-5 mb-1 sm:mb-0" />
                <span>{tab.label}</span>
              </TabsTrigger>
            );
          })}
        </TabsList>

        <TabsContent value="profile">
          <UserInfoSection />
        </TabsContent>
        <TabsContent value="settings">
          <AccountSettingsSection />
        </TabsContent>
        <TabsContent value="subscription">
           <SubscriptionSection />
        </TabsContent>
        <TabsContent value="history">
          <WatchHistorySection />
        </TabsContent>
        <TabsContent value="payments">
          <PaymentHistorySection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
