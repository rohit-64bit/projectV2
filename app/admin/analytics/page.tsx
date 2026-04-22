'use client';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { useDoubts, useMaterials } from '@/hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, MessageCircle, BarChart3, TrendingUp, Activity } from 'lucide-react';

export default function AnalyticsPage() {
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

  // Calculate analytics
  const subjectStats = materials.reduce(
    (acc, m) => {
      if (!acc[m.subject]) {
        acc[m.subject] = { materials: 0, views: 0, downloads: 0 };
      }
      acc[m.subject].materials += 1;
      acc[m.subject].views += m.views;
      acc[m.subject].downloads += m.downloads;
      return acc;
    },
    {} as Record<string, { materials: number; views: number; downloads: number }>
  );

  const doubtSubjectStats = doubts.reduce(
    (acc, d) => {
      if (!acc[d.subject]) {
        acc[d.subject] = { count: 0, open: 0, answered: 0 };
      }
      acc[d.subject].count += 1;
      if (d.status === 'open') acc[d.subject].open += 1;
      if (d.status === 'answered') acc[d.subject].answered += 1;
      return acc;
    },
    {} as Record<string, { count: number; open: number; answered: number }>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600 mt-2">Comprehensive insights into platform usage and performance</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Materials by Subject</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{Object.keys(subjectStats).length}</div>
                <p className="text-xs text-gray-500 mt-1">subject categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {materials.reduce((sum, m) => sum + m.views, 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">all materials combined</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {materials.reduce((sum, m) => sum + m.downloads, 0)}
                </div>
                <p className="text-xs text-gray-500 mt-1">all materials combined</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Avg Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">4.8/10</div>
                <p className="text-xs text-gray-500 mt-1">engagement score</p>
              </CardContent>
            </Card>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Materials by Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  Materials by Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(subjectStats).map(([subject, stats]) => (
                    <div key={subject} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{subject}</h4>
                        <span className="text-sm text-gray-600">{stats.materials} materials</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Views: </span>
                          <span className="font-bold text-gray-900">{stats.views}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Downloads: </span>
                          <span className="font-bold text-gray-900">{stats.downloads}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Doubts by Subject */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-yellow-600" />
                  Doubts by Subject
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(doubtSubjectStats).map(([subject, stats]) => (
                    <div key={subject} className="border-b pb-3 last:border-b-0">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium text-gray-900">{subject}</h4>
                        <span className="text-sm text-gray-600">{stats.count} questions</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="text-gray-600">Open: </span>
                          <span className="font-bold text-yellow-600">{stats.open}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Answered: </span>
                          <span className="font-bold text-green-600">{stats.answered}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-600" />
                Platform Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Active Users</p>
                  <p className="text-2xl font-bold text-blue-600 mt-2">342</p>
                  <p className="text-xs text-gray-500 mt-1">this week</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">New Sign-ups</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">48</p>
                  <p className="text-xs text-gray-500 mt-1">this month</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Avg Session</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">24m</p>
                  <p className="text-xs text-gray-500 mt-1">per user</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600 font-medium">Return Rate</p>
                  <p className="text-2xl font-bold text-orange-600 mt-2">68%</p>
                  <p className="text-xs text-gray-500 mt-1">user retention</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
