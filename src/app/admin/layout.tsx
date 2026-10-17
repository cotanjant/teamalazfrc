import type { Metadata } from "next";
import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminShellProvider } from "@/components/admin/shell/AdminShellContext";
import { AdminSidebar } from "@/components/admin/shell/AdminSidebar";
import { AdminHeader } from "@/components/admin/shell/AdminHeader";
import { AdminTour } from "@/components/admin/tour";
import { AdminStoreProvider } from "@/lib/admin/useAdminStore";

export const metadata: Metadata = {
  title: "İçerik Yönetimi | Team ALAZ",
  description: "Team ALAZ İçerik Yönetim Merkezi",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AdminStoreProvider>
        <AdminShellProvider>
          <div className="min-h-[100dvh] h-[100dvh] w-full overflow-hidden flex bg-[#0A0A0A] text-[#E8E8E8]">
            <AdminSidebar />
            <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
              <AdminHeader />
              <main
                id="admin-main-scroll"
                data-lenis-prevent="true"
                className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6 lg:p-8 scrollbar-thin focus:outline-none"
              >
                <div className="max-w-7xl mx-auto w-full">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <AdminTour />
        </AdminShellProvider>
      </AdminStoreProvider>
    </AdminGuard>
  );
}
