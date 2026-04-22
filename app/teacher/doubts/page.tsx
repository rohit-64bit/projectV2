'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { DoubtCard } from '@/components/doubt-card';
import { useDoubts } from '@/hooks/use-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { BarChart3, MessageCircle, BookOpen } from 'lucide-react';

export default function TeacherDoubtsPage() {
  const { data: doubts = [] } = useDoubts();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'open' | 'answered' | 'closed'>('open');

  const sidebarItems = [
    {
      label: 'Dashboard',
      href: '/teacher',
      icon: <BarChart3 className="w-5 h-5" />,
    },
    {
      label: 'Student Doubts',
      href: '/teacher/doubts',
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      label: 'Share Materials',
      href: '/teacher/materials',
      icon: <BookOpen className="w-5 h-5" />,
    },
  ];

  const filteredDoubts = doubts.filter((doubt) => {
    const matchesSearch =
      doubt.question.toLowerCase().includes(search.toLowerCase()) ||
      doubt.description.toLowerCase().includes(search.toLowerCase()) ||
      doubt.studentName.toLowerCase().includes(search.toLowerCase());
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
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Student Doubts</h1>
            <p className="text-gray-600 mt-2">Answer questions and help students learn</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-yellow-600">Open</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.open}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-green-600">Answered</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.answered}</p>
            </Card>
            <Card className="p-4">
              <p className="text-sm font-medium text-gray-600">Closed</p>
              <p className="text-2xl font-bold text-gray-600 mt-1">{stats.closed}</p>
            </Card>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Search by question, student, or subject..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="flex flex-wrap gap-2">
                {(['open', 'answered', 'closed', 'all'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                      filter === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {status === 'all' ? 'All Questions' : status}
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
                <p className="text-sm text-gray-400 mt-1">
                  {filter === 'open'
                    ? 'All questions have been answered!'
                    : 'Try adjusting your search or filters'}
                </p>
              </Card>
            ) : (
              filteredDoubts.map((doubt) => <DoubtCard key={doubt.id} doubt={doubt} isTeacher />)
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
