
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Suspense } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export function SidebarItem(props: SidebarItemProps) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm">
          <props.icon className="h-5 w-5 shrink-0 text-gray-400" />
          <span className="flex-1 text-gray-400">{props.label}</span>
        </div>
      }
    >
      <SidebarItemContent {...props} />
    </Suspense>
  );
}

function SidebarItemContent({
  href,
  icon: Icon,
  label,
  badge,
}: SidebarItemProps) {
  const pathname = usePathname();
  const isActive =
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive
          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && badge > 0 && (
        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 text-xs font-semibold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
