'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { MaterialCard } from '@/components/material-card';
import { useMaterials, useDownloadMaterial } from '@/hooks/use-data';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TrendingUp, BookOpen, MessageCircle, Search } from 'lucide-react';

export default function MaterialsPage() {
  const { data: materials = [] } = useMaterials();
  const downloadMutation = useDownloadMaterial();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

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

  const subjects = Array.from(new Set(materials.map((m) => m.subject)));

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch =
      material.title.toLowerCase().includes(search.toLowerCase()) ||
      material.description.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = !selectedSubject || material.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  const handleDownload = (materialId: string) => {
    downloadMutation.mutate(materialId);
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
            <h1 className="text-3xl font-bold text-gray-900">Learning Materials</h1>
            <p className="text-gray-600 mt-2">Browse and download course materials</p>
          </div>

          {/* Search and Filter */}
          <Card className="p-6 mb-8">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search materials by title or description..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedSubject('')}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    !selectedSubject
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Subjects
                </button>
                {subjects.map((subject) => (
                  <button
                    key={subject}
                    onClick={() => setSelectedSubject(subject)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedSubject === subject
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Materials List */}
          <div className="space-y-4">
            {filteredMaterials.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No materials found</p>
                <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
              </Card>
            ) : (
              filteredMaterials.map((material) => (
                <MaterialCard
                  key={material.id}
                  material={material}
                  onDownload={handleDownload}
                />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
