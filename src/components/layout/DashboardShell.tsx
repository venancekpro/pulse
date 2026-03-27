"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Sidebar } from "@/components/layout/Sidebar";
import { ShellLoader } from "@/components/layout/ShellLoader";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useAuth } from "@/hooks/useAuth";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <ShellLoader />;
  }

  return (
    <div className="pulse-lumis-bg flex min-h-[100dvh] min-h-screen w-full transition-colors duration-700 ease-out">
      <div className="hidden lg:flex lg:min-h-screen">
        <Sidebar />
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="lumis-sidebar-panel w-64 border-0 p-0 backdrop-blur-xl"
        >
          <Sidebar onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <Navbar onMenuClick={() => setOpen(true)} />
        <main className="custom-scrollbar mx-auto max-h-[calc(100vh-3.5rem)] w-full max-w-[1600px] flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
