'use client';

import { useState } from 'react';
import { Sidebar } from './sidebar';
import { Menu, Bell } from 'lucide-react';
import { ToastContainer } from '@/components/ui/toast';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-radial bg-grid fixed inset-0 pointer-events-none" />

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Mobile top bar */}
      <header className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center px-4 border-b border-white/5 bg-background/80 backdrop-blur-xl z-30">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-colors mr-3"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-[10px] font-bold text-white">CT</span>
          </div>
          <span className="font-semibold text-sm">CareerTwin</span>
        </div>
        <div className="ml-auto">
          <button className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-white/5 transition-colors">
            <Bell className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="md:ml-64 min-h-screen relative">
        <div className="pt-14 md:pt-0 p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      <ToastContainer />
    </div>
  );
}
