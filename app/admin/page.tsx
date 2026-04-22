'use client';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth-context';
import { useDoubts, useMaterials } from '@/hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageCircle, BarChart3, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  const { user } = useAuth();
  const { data: doubts = [] } = useDoubts();
  const { data: materials = [] } = useMaterials();

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

  // Calculate stats
  const doubtStats = {
    total: doubts.length,
    open: doubts.filter((d) => d.status === 'open').length,
    answered: doubts.filter((d) => d.status === 'answered').length,
    avgResponseTime: '4.2 hours',
  };

  const materialStats = {
    total: materials.length,
    totalViews: materials.reduce((sum, m) => sum + m.views, 0),
    totalDownloads: materials.reduce((sum, m) => sum + m.downloads, 0),
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
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Platform overview and management tools</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">1,250</div>
                <p className="text-xs text-gray-500 mt-1">+12% this month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{materialStats.total}</div>
                <p className="text-xs text-gray-500 mt-1">{materialStats.totalViews} views</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Doubts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{doubtStats.total}</div>
                <p className="text-xs text-gray-500 mt-1">{doubtStats.open} open</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">87%</div>
                <p className="text-xs text-gray-500 mt-1">user participation</p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Doubts Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Doubts Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Total Questions</span>
                    <span className="font-bold text-gray-900">{doubtStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Open</span>
                    <span className="font-bold text-yellow-600">{doubtStats.open}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Answered</span>
                    <span className="font-bold text-green-600">{doubtStats.answered}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Avg Response</span>
                    <span className="font-bold text-gray-900">{doubtStats.avgResponseTime}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Materials Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Total Materials</span>
                    <span className="font-bold text-gray-900">{materialStats.total}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Total Views</span>
                    <span className="font-bold text-blue-600">{materialStats.totalViews}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Total Downloads</span>
                    <span className="font-bold text-green-600">{materialStats.totalDownloads}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Avg Downloads</span>
                    <span className="font-bold text-gray-900">
                      {Math.round(materialStats.totalDownloads / (materialStats.total || 1))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Health */}
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-bold text-green-600">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Avg Response Time</span>
                    <span className="font-bold text-gray-900">145ms</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Server Status</span>
                    <span className="text-green-600 font-bold">✓ Healthy</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600">Last Check</span>
                    <span className="text-xs text-gray-500">2 mins ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/admin/users" className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                  <Users className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Manage Users</h3>
                  <p className="text-xs text-gray-600 mt-1">Add, edit, or remove users</p>
                </a>
                <a href="/admin/analytics" className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                  <TrendingUp className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-900">View Analytics</h3>
                  <p className="text-xs text-gray-600 mt-1">Platform insights & reports</p>
                </a>
                <a href="/" className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                  <MessageCircle className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-900">Support</h3>
                  <p className="text-xs text-gray-600 mt-1">Contact customer support</p>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
