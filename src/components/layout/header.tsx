
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Clapperboard, Search, UserCircle, LogIn, LogOut, Crown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggleButton } from "./theme-toggle-button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { initiateUPIPayment, UPIPaymentStatus } from '@/services/upi-payment';
import { useToast } from "@/hooks/use-toast";


export function Header() {
  const { isAuthenticated, userRole, userName, setUserRole, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  const noContainerRoutes = ['/login', '/signup'];
  // On login/signup pages, we don't use the container for header content,
  // and simplify the header by hiding search and sidebar trigger.
  const useContainerAndFullFeatures = !noContainerRoutes.includes(pathname);

  const handleLogout = () => {
    logout();
    toast({ title: "Logged Out", description: "You have been successfully logged out." });
    router.push('/'); 
  };

  const handleUpgrade = async () => {
    if (userRole === "paid_user") {
      toast({ title: "Already Premium", description: "You are already a premium user." });
      return;
    }
    try {
      const paymentDetails = {
        upiId: "vidshare@exampleupi",
        recipientName: "VidShare Subscriptions",
        amount: 299, 
        notes: "VidShare Premium Subscription",
      };
      toast({ title: "Processing Payment...", description: "Please wait while we process your UPI payment." });
      const result = await initiateUPIPayment(paymentDetails);
      if (result.status === UPIPaymentStatus.SUCCESS) {
        setUserRole("paid_user", userName || "Premium User");
        toast({ title: "Payment Successful!", description: "Welcome to VidShare Premium!" });
      } else {
        toast({ variant: "destructive", title: "Payment Failed", description: result.message || "Unable to process payment." });
      }
    } catch (error) {
       toast({ variant: "destructive", title: "Payment Error", description: "An error occurred during payment." });
    }
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className={useContainerAndFullFeatures ? "container flex h-16 items-center justify-between" : "w-full flex h-16 items-center justify-between px-4 md:px-6"}>
        <div className="flex items-center gap-4">
          {useContainerAndFullFeatures && <SidebarTrigger className="md:hidden" />}
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-xl">
            <Clapperboard className="h-6 w-6 text-primary" />
            <span className="hidden sm:inline">VidShare</span>
          </Link>
        </div>

        {useContainerAndFullFeatures && (
          <div className="flex-1 max-w-md mx-4 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search videos..." className="pl-10 w-full rounded-full" />
            </div>
          </div>
        )}
        
        <div className="flex items-center gap-3">
          {useContainerAndFullFeatures && (
            <div className="md:hidden">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Button>
            </div>
          )}
          <ThemeToggleButton />
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://avatar.vercel.sh/${userName?.replace(/\s/g, '') || 'user'}.png`} alt={userName || "User"} />
                    <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{userName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userRole === "paid_user" ? "Premium Member" : (userRole === "free_user" ? "Free Member" : "Guest")}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/profile')}> 
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                {userRole !== "paid_user" && (
                  <DropdownMenuItem onClick={handleUpgrade}>
                    <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                    <span>Upgrade to Premium</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
             <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" /> Login
              </Link>
            </Button>
          )}
        </div>
      </div>
       {useContainerAndFullFeatures && (
        <div className="md:hidden px-4 pb-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input type="search" placeholder="Search videos..." className="pl-10 w-full rounded-full" />
            </div>
          </div>
        )}
    </header>
  );
}

