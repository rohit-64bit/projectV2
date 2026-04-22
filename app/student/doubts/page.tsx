'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { DoubtCard } from '@/components/doubt-card';
import { useDoubts } from '@/hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, BookOpen, MessageCircle, Plus } from 'lucide-react';
import Link from 'next/link';

export default function DoubtsPage() {
  const { data: doubts = [] } = useDoubts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('all');

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/student',
      icon: <TrendingUp className="w-5 h-5" />,
    },
    {
      label: 'Chat with AI',
      href: '/student/chat',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      label: 'Learning Materials',
      href: '/student/materials',
      icon: <BookOpen className="w-5 h-5" />,
    },
    {
      label: 'Ask Doubts',
      href: '/student/doubts',
      icon: <MessageCircle className="w-5 h-5" />,
    },
  ];

  const filteredDoubts = doubts.filter((doubt) => {
    const matchesSearch =
      doubt.question.toLowerCase().includes(search.toLowerCase()) ||
      doubt.description.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || doubt.status === filter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: doubts.length,
    open: doubts.filter((d) => d.status === 'open').length,
    answered: doubts.filter((d) => d.status === 'answered').length,
    closed: doubts.filter((d) => d.status === 'closed').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ask Your Doubts</h1>
              <p className="text-gray-600 mt-2">Get help from teachers and the community</p>
            </div>
            <Link href="/student/doubts/new">
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Ask a Question
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Open</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.open}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Answered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.answered}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Closed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {(['all', 'open', 'answered', 'closed'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Doubts List */}
          <div className="space-y-4">
            {filteredDoubts.length === 0 ? (
              <Card className="p-12 text-center">
                <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No doubts found</p>
                <p className="text-sm text-gray-400 mt-1">Ask your first question to get started</p>
              </Card>
            ) : (
              filteredDoubts.map((doubt) => <DoubtCard key={doubt.id} doubt={doubt} />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
