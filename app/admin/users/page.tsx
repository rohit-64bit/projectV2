'use client';

import { useMemo, useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  useAdminUsers,
  useCreateAdminUser,
  useDeleteAdminUser,
  useUpdateAdminUser,
} from '@/hooks/use-data';
import { Users, BarChart3, TrendingUp, Search } from 'lucide-react';

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'all' | 'student' | 'teacher' | 'admin'>('all');
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'teacher' | 'admin',
    password: '',
  });

  const { data: users = [] } = useAdminUsers();
  const createUserMutation = useCreateAdminUser();
  const updateUserMutation = useUpdateAdminUser();
  const deleteUserMutation = useDeleteAdminUser();

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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = selectedRole === 'all' || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  }, [search, selectedRole, users]);

  const userStats = {
    total: users.length,
    students: users.filter((u) => u.role === 'student').length,
    teachers: users.filter((u) => u.role === 'teacher').length,
    admins: users.filter((u) => u.role === 'admin').length,
    active: users.filter((u) => u.status === 'active').length,
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
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    await createUserMutation.mutateAsync(newUser);
    setNewUser({ name: '', email: '', role: 'student', password: '' });
  };

  const handleToggleStatus = async (userId: string, status: 'active' | 'inactive') => {
    await updateUserMutation.mutateAsync({
      userId,
      updates: {
        status: status === 'active' ? 'inactive' : 'active',
      },
    });
  };

  const handleDelete = async (userId: string) => {
    await deleteUserMutation.mutateAsync(userId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
            <p className="text-gray-600 mt-2">Admin MVP CRUD: create, update status, and delete users</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-gray-900">{userStats.total}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Students</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-blue-600">{userStats.students}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Teachers</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{userStats.teachers}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-purple-600">{userStats.admins}</div></CardContent></Card>
            <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{userStats.active}</div></CardContent></Card>
          </div>

          <Card className="p-6 mb-8">
            <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <Input value={newUser.name} onChange={(e) => setNewUser((prev) => ({ ...prev, name: e.target.value }))} placeholder="Name" required />
              <Input value={newUser.email} onChange={(e) => setNewUser((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email" type="email" required />
              <select value={newUser.role} onChange={(e) => setNewUser((prev) => ({ ...prev, role: e.target.value as 'student' | 'teacher' | 'admin' }))} className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                <option value="student">student</option>
                <option value="teacher">teacher</option>
                <option value="admin">admin</option>
              </select>
              <Input value={newUser.password} onChange={(e) => setNewUser((prev) => ({ ...prev, password: e.target.value }))} placeholder="Temporary password" type="password" required />
              <Button type="submit" disabled={createUserMutation.isPending}>Create User</Button>
            </form>
          </Card>

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
                      selectedRole === role ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    type="button"
                  >
                    {role === 'all' ? 'All Users' : role + 's'}
                  </button>
                ))}
              </div>
            </div>
          </Card>

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
                        <td colSpan={5} className="py-8 text-center text-gray-500">No users found</td>
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
                          <td className="py-3 px-4"><Badge className={getRoleColor(user.role)} variant="secondary">{user.role}</Badge></td>
                          <td className="py-3 px-4 text-gray-600">{new Date(user.joinDate).toLocaleDateString()}</td>
                          <td className="py-3 px-4"><Badge className={getStatusColor(user.status)} variant="secondary">{user.status}</Badge></td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <button type="button" className="text-blue-600 hover:text-blue-700 font-medium text-sm" onClick={() => handleToggleStatus(user.id, user.status)}>
                                {user.status === 'active' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button type="button" className="text-red-600 hover:text-red-700 font-medium text-sm" onClick={() => handleDelete(user.id)} disabled={deleteUserMutation.isPending}>
                                Delete
                              </button>
                            </div>
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
