'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Home,
  Video,
  Calendar,
  FileText,
  Users,
  BookOpen,
  VideoIcon,
  Plus,
  BarChart3,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState('student');

  useEffect(() => {
    setUserRole(localStorage.getItem('userRole') || 'student');
  }, []);

  const studentNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Lectures', href: '/lectures', icon: Video },
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Documents', href: '/documents', icon: FileText },
    { name: 'Live Sessions', href: '/live-sessions', icon: VideoIcon },
  ];

  const instructorNavItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Courses', href: '/courses', icon: BookOpen },
    { name: 'Manage Lectures', href: '/lectures', icon: Video },
    { name: 'Schedule Events', href: '/events', icon: Calendar },
    { name: 'Upload Documents', href: '/documents', icon: FileText },
    { name: 'Live Sessions', href: '/live-sessions', icon: VideoIcon },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'My Profile', href: '/profile', icon: Settings },
  ];

  const navItems = userRole === 'instructor' ? instructorNavItems : studentNavItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 px-4 py-6 space-y-2">
            {userRole === 'instructor' && (
              <div className="mb-6">
                <Link href="/create" onClick={onClose}>
                  <div className="flex items-center space-x-3 px-4 py-3 rounded-lg vedic-gradient text-white hover:opacity-90 transition-opacity cursor-pointer">
                    <Plus className="h-5 w-5" />
                    <span className="font-medium">Create Content</span>
                  </div>
                </Link>
              </div>
            )}

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link key={item.name} href={item.href} onClick={onClose}>
                    <div
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors cursor-pointer',
                        isActive
                          ? 'bg-orange-50 text-orange-700 border-r-2 border-orange-500'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t border-gray-200">
            <Link href="/settings" onClick={onClose}>
              <div className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors cursor-pointer">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}