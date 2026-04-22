'use client';

import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth-context';
import { useDoubts, useMaterials } from '@/hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, BarChart3, Upload } from 'lucide-react';
import Link from 'next/link';

export default function TeacherPage() {
  const { user } = useAuth();
  const { data: doubts = [] } = useDoubts();
  const { data: materials = [] } = useMaterials();

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/dashboard/teacher',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Student Doubts',
      href: '/dashboard/teacher/doubts',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      label: 'Share Materials',
      href: '/dashboard/teacher/materials',
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  const openDoubts = doubts.filter((d) => d.status === 'open').length;
  const myMaterials = materials.filter((m) => m.uploadedBy === user?.id).length;
  const totalViews = materials.filter((m) => m.uploadedBy === user?.id).reduce((sum, m) => sum + m.views, 0);
  const totalDownloads = materials.filter((m) => m.uploadedBy === user?.id).reduce((sum, m) => sum + m.downloads, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Manage your doubts and learning materials</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Open Doubts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{openDoubts}</div>
                <p className="text-xs text-gray-500 mt-1">awaiting response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Materials Shared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{myMaterials}</div>
                <p className="text-xs text-gray-500 mt-1">total documents</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalViews}</div>
                <p className="text-xs text-gray-500 mt-1">on your materials</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{totalDownloads}</div>
                <p className="text-xs text-gray-500 mt-1">material downloads</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/dashboard/teacher/doubts" className="p-4 border-2 border-yellow-200 rounded-lg hover:bg-yellow-50 transition-colors">
                    <MessageCircle className="w-6 h-6 text-yellow-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Answer Doubts</h3>
                    <p className="text-xs text-gray-600 mt-1">{openDoubts} pending</p>
                  </Link>
                  <Link href="/dashboard/teacher/materials" className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <Upload className="w-6 h-6 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Share Materials</h3>
                    <p className="text-xs text-gray-600 mt-1">Upload documents</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Teaching Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Teaching Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Quick Feedback</p>
                    <p className="text-xs text-blue-700 mt-2">
                      Respond to doubts within 24 hours for better engagement.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Share Often</p>
                    <p className="text-xs text-green-700 mt-2">
                      Upload materials regularly to keep students engaged.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
