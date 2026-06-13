import { redirect } from "next/navigation";

import { auth } from "@/auth/auth";
import { AppSidebar } from "@/components/modules/layout/AppSidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.accessToken) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="page-gradient min-h-dvh">
        <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border/60 bg-background px-4 md:px-6">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="hidden h-4 sm:block" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Parts Desk</p>
            <p className="text-muted-foreground hidden truncate text-xs sm:block">
              Student electronics inventory
            </p>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
