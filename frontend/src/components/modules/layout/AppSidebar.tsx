"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ActivityIcon,
  BoxesIcon,
  CpuIcon,
  LogOutIcon,
  SettingsIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

import { ThemeToggle } from "@/components/modules/layout/ThemeToggle";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/components", label: "Components", icon: BoxesIcon },
  { href: "/activity", label: "Activity", icon: ActivityIcon },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
      <SidebarHeader className="border-b border-sidebar-border/80 px-4 py-4 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-2">
        <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0">
          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-lg shadow-sm group-data-[collapsible=icon]:size-8">
            <CpuIcon className="size-4 group-data-[collapsible=icon]:size-3.5" aria-hidden />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-tight">Parts Desk</p>
            <p className="text-muted-foreground truncate text-xs">Student inventory</p>
          </div>
          <div className="ml-auto group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground px-2 text-[11px] tracking-widest uppercase group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:h-0">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.href} />}
                      className={cn(
                        "h-10 rounded-lg px-3",
                        isActive && "bg-sidebar-accent font-medium shadow-sm",
                      )}
                    >
                      <item.icon className="size-4" aria-hidden />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border/80 p-3 group-data-[collapsible=icon]:p-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOutIcon className="size-4 shrink-0" aria-hidden />
          <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
