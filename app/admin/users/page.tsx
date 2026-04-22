'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Users, BarChart3, TrendingUp, Search } from 'lucide-react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/admin',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Platform Analytics',
      href: '/admin/analytics',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: 'Manage Users',
      href: '/admin/users',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  // Mock user data
  const allUsers = [
    {
      id: '1',
      name: 'John Student',
      email: 'john@student.com',
      role: 'student' as const,
      joinDate: '2024-01-15',
      status: 'active' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=john@student.com',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@teacher.com',
      role: 'teacher' as const,
      joinDate: '2023-06-20',
      status: 'active' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah@teacher.com',
    },
    {
      id: '3',
      name: 'Mike Teacher',
      email: 'mike@teacher.com',
      role: 'teacher' as const,
      joinDate: '2023-08-10',
      status: 'active' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike@teacher.com',
    },
    {
      id: '4',
      name: 'Admin User',
      email: 'admin@platform.com',
      role: 'admin' as const,
      joinDate: '2023-01-01',
      status: 'active' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin@platform.com',
    },
    {
      id: '5',
      name: 'Emma Student',
      email: 'emma@student.com',
      role: 'student' as const,
      joinDate: '2024-02-10',
      status: 'active' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma@student.com',
    },
    {
      id: '6',
      name: 'Alex Chen',
      email: 'alex@student.com',
      role: 'student' as const,
      joinDate: '2024-03-05',
      status: 'inactive' as const,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex@student.com',
    },
  ];

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const userStats = {
    total: allUsers.length,
    students: allUsers.filter((u) => u.role === 'student').length,
    teachers: allUsers.filter((u) => u.role === 'teacher').length,
    admins: allUsers.filter((u) => u.role === 'admin').length,
    active: allUsers.filter((u) => u.status === 'active').length,
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'student':
        return 'bg-blue-100 text-blue-800';
      case 'teacher':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-2">View and manage all platform users</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{userStats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userStats.students}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Teachers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.teachers}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{userStats.admins}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.active}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                {(['all', 'student', 'teacher', 'admin'] as const).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      selectedRole === role
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {role === 'all' ? 'All Users' : role + 's'}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Users Table */}
          <Card>
            <CardHeader>
              <CardTitle>Users List ({filteredUsers.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Join Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} alt={user.name} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <Badge className={getRoleColor(user.role)} variant="secondary">
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-3 px-4 text-gray-600">{user.joinDate}</td>
                          <td className="py-3 px-4">
                            <Badge className={getStatusColor(user.status)} variant="secondary">
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                              View
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
