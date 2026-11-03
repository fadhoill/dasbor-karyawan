'use client';

import { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Wallet, 
  TrendingUp,
  Menu,
  X
} from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/karyawan', icon: Users, label: 'Karyawan' },
    { href: '/payroll', icon: Wallet, label: 'Payroll' },
    { href: '/performance', icon: TrendingUp, label: 'Performance' },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg dark:bg-gray-800"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 z-40 h-screen transition-transform',
          'lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col">
          {/* Logo/Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              Dasbor Karyawan
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manajemen SDM
            </p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {menuItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  icon={item.icon}
                  label={item.label}
                />
              ))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800">
            <div className="text-xs text-gray-500 dark:text-gray-400">
              © 2026 Dasbor Karyawan
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
