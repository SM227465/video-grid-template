
"use client";

import { Home, TrendingUp, Youtube, History, Tags, ShieldCheck, Settings, HelpCircle, Briefcase } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";


const mainNavLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/subscriptions", label: "Subscriptions", icon: Youtube },
  { href: "/history", label: "History", icon: History },
];

const filterCategories = [
  { label: "Technology", count: 12 },
  { label: "Gaming", count: 8 },
  { label: "Music", count: 23 },
  { label: "Education", count: 5 },
  { label: "Sports", count: 15 },
];

const videoQualities = ["1080p", "720p", "480p"];

export function AppSidebar() {
  const pathname = usePathname();
  const { userRole } = useAuth();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
      <SidebarHeader className="p-0"></SidebarHeader>
      <SidebarContent className="p-0">
        <SidebarMenu className="py-2 px-2">
          {mainNavLinks.map((link) => (
            <SidebarMenuItem key={link.href}>
              <Link href={link.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === link.href}
                  tooltip={{ children: link.label, side: "right", align: "center" }}
                  className="justify-start"
                >
                  <link.icon className="h-5 w-5" />
                  <span>{link.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
           <SidebarMenuItem>
              <Link href="/plans" legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === "/plans"}
                  tooltip={{ children: "Subscription Plans", side: "right", align: "center" }}
                  className="justify-start"
                >
                  <Briefcase className="h-5 w-5" />
                  <span>{userRole === "paid_user" ? "My Subscription" : "View Plans"}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
        </SidebarMenu>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center">
            <Tags className="mr-2" />
            Filter by Tags
          </SidebarGroupLabel>
          <SidebarMenu className="px-0">
            {filterCategories.slice(0,3).map((category) => (
              <SidebarMenuItem key={category.label}>
                <SidebarMenuButton size="sm" className="justify-between">
                  <span>{category.label}</span>
                  <Badge variant="secondary" className="text-xs">{category.count}</Badge>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton size="sm" variant="link" className="text-primary">
                  Show more
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center">
            <ShieldCheck className="mr-2" />
            Video Quality
          </SidebarGroupLabel>
          <SidebarMenu className="px-0">
            {videoQualities.map((quality) => (
              <SidebarMenuItem key={quality}>
                <SidebarMenuButton size="sm">
                  {quality}
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-0 border-t">
        <SidebarMenu className="px-2 py-2">
           <SidebarMenuItem>
             <Link href="/profile?tab=settings" legacyBehavior passHref>
                <SidebarMenuButton 
                    isActive={pathname === "/profile" && new URLSearchParams(window.location.search).get('tab') === 'settings'}
                    tooltip={{ children: "Settings", side: "right", align: "center"}} 
                    className="justify-start"
                >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
                </SidebarMenuButton>
              </Link>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip={{ children: "Help", side: "right", align: "center"}} className="justify-start">
              <HelpCircle className="h-5 w-5" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

