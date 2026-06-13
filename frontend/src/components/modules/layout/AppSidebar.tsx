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
  useSidebar,
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
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border/80">
      <SidebarHeader
        className={cn(
          "border-b border-sidebar-border/80",
          collapsed ? "items-center px-0 py-2" : "px-4 py-4",
        )}
      >
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "w-full justify-center gap-0",
          )}
        >
          <div
            className={cn(
              "bg-sidebar-primary text-sidebar-primary-foreground flex shrink-0 items-center justify-center rounded-lg shadow-sm",
              collapsed ? "size-8" : "size-9",
            )}
          >
            <CpuIcon className={cn(collapsed ? "size-3.5" : "size-4")} aria-hidden />
          </div>
          {!collapsed && (
            <>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold tracking-tight">Parts Desk</p>
                <p className="text-muted-foreground truncate text-xs">Student inventory</p>
              </div>
              <div className="ml-auto">
                <ThemeToggle />
              </div>
            </>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className={cn("py-4", collapsed ? "gap-1 px-0 py-2" : "px-2")}>
        <SidebarGroup className={cn(collapsed && "p-0")}>
          {!collapsed && (
            <SidebarGroupLabel className="text-muted-foreground px-2 text-[11px] tracking-widest uppercase">
              Workspace
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(collapsed && "items-center gap-1")}>
              {navItems.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <SidebarMenuItem key={item.href} className={cn(collapsed && "flex justify-center")}>
                    <SidebarMenuButton
                      isActive={isActive}
                      render={<Link href={item.href} />}
                      className={cn(
                        "rounded-lg",
                        collapsed ? "size-8! p-0!" : "h-10 px-3",
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
      <SidebarFooter
        className={cn(
          "border-t border-sidebar-border/80",
          collapsed ? "flex items-center px-0 py-2" : "p-3",
        )}
      >
        <Button
          variant="outline"
          className={cn(
            "gap-2",
            collapsed
              ? "mx-auto size-8 justify-center p-0"
              : "w-full justify-start",
          )}
          onClick={() => signOut({ callbackUrl: "/login" })}
        >
          <LogOutIcon className="size-4 shrink-0" aria-hidden />
          {!collapsed && <span>Sign out</span>}
        </Button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
