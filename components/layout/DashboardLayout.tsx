import { AppHeader } from "./AppHeader";
import { AppSidebar } from "./AppSidebar";

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AppSidebar />

      <div className="flex-1">
        <AppHeader />

        <main>
          {children}
        </main>
      </div>
    </div>
  );
}