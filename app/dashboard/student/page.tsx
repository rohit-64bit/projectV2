'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { useAuth } from '@/lib/auth-context';
import { useStudentProgress } from '@/hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, MessageCircle, TrendingUp, Clock } from 'lucide-react';
import Link from 'next/link';

export default function StudentPage() {
  const { user } = useAuth();
  const { data: progress } = useStudentProgress(user?.id || '');

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/dashboard/student',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: 'Chat with AI',
      href: '/dashboard/student/chat',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      label: 'Learning Materials',
      href: '/dashboard/student/materials',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Ask Doubts',
      href: '/dashboard/student/doubts',
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="text-gray-600 mt-2">Here's your learning progress at a glance</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Lessons Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{progress?.totalLessonsCompleted || 0}</div>
                <p className="text-xs text-gray-500 mt-1">lessons finished</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{progress?.averageScore || 0}%</div>
                <p className="text-xs text-gray-500 mt-1">overall performance</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{progress?.currentStreak || 0}</div>
                <p className="text-xs text-gray-500 mt-1">days active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Study Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{progress?.studyHoursThisWeek || 0}h</div>
                <p className="text-xs text-gray-500 mt-1">this week</p>
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
                  <Link href="/dashboard/student/chat" className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors">
                    <MessageCircle className="w-6 h-6 text-blue-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Chat with AI</h3>
                    <p className="text-xs text-gray-600 mt-1">Get help anytime</p>
                  </Link>
                  <Link href="/dashboard/student/doubts" className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors">
                    <MessageCircle className="w-6 h-6 text-green-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Ask Doubts</h3>
                    <p className="text-xs text-gray-600 mt-1">Get teacher's help</p>
                  </Link>
                  <Link href="/dashboard/student/materials" className="p-4 border-2 border-purple-200 rounded-lg hover:bg-purple-50 transition-colors">
                    <BookOpen className="w-6 h-6 text-purple-600 mb-2" />
                    <h3 className="font-medium text-gray-900">Study Materials</h3>
                    <p className="text-xs text-gray-600 mt-1">Browse resources</p>
                  </Link>
                  <Link href="/dashboard/student" className="p-4 border-2 border-orange-200 rounded-lg hover:bg-orange-50 transition-colors">
                    <Clock className="w-6 h-6 text-orange-600 mb-2" />
                    <h3 className="font-medium text-gray-900">My Progress</h3>
                    <p className="text-xs text-gray-600 mt-1">View analytics</p>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Learning Tip */}
            <Card>
              <CardHeader>
                <CardTitle>Learning Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Consistent Practice</p>
                    <p className="text-xs text-blue-700 mt-2">
                      Studying for 30 minutes daily is more effective than cramming for 4 hours once a week.
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm font-medium text-green-900">Use AI Wisely</p>
                    <p className="text-xs text-green-700 mt-2">
                      Don't just ask for answers. Ask AI to explain concepts and help you understand better.
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
