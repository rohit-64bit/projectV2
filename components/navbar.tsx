'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { BookOpen, LogOut, Settings } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'text-blue-600';
      case 'teacher':
        return 'text-green-600';
      case 'admin':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push(`/${user?.role}`)}>
            <BookOpen className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">BrightFlow</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} alt={user?.name} />
                    <AvatarFallback>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden sm:block text-sm">
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className={`text-xs ${getRoleColor(user?.role || '')}`}>
                      {user?.role.charAt(0).toUpperCase() + user?.role.slice(1)}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
