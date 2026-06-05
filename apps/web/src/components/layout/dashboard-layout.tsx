import { Sidebar } from './sidebar';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-radial bg-grid fixed inset-0 pointer-events-none" />
      <Sidebar />
      <main className="ml-64 min-h-screen relative">
        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
