'use client';

import { useState } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { MaterialCard } from '@/components/material-card';
import { useMaterials, useUploadMaterial } from '@/hooks/use-data';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BarChart3, MessageCircle, BookOpen, Plus, Upload } from 'lucide-react';

export default function TeacherMaterialsPage() {
  const { user } = useAuth();
  const { data: materials = [] } = useMaterials();
  const uploadMutation = useUploadMaterial();
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    description: '',
    fileType: 'pdf',
  });

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

  const myMaterials = materials.filter((m) => m.uploadedBy === user?.id);
  const totalViews = myMaterials.reduce((sum, m) => sum + m.views, 0);
  const totalDownloads = myMaterials.reduce((sum, m) => sum + m.downloads, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.subject || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await uploadMutation.mutateAsync({
        title: formData.title,
        subject: formData.subject,
        description: formData.description,
        uploadedBy: user?.id || '',
        uploadedByName: user?.name || 'Unknown',
        uploadedAt: new Date(),
        fileUrl: '#',
        fileType: formData.fileType,
        views: 0,
        downloads: 0,
      });

      setFormData({ title: '', subject: '', description: '', fileType: 'pdf' });
      setShowUploadForm(false);
    } catch (error) {
      console.error('Failed to upload material:', error);
      alert('Failed to upload material');
    }
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
              <h1 className="text-3xl font-bold text-gray-900">My Learning Materials</h1>
              <p className="text-gray-600 mt-2">Share documents and resources with students</p>
            </div>
            <Button onClick={() => setShowUploadForm(!showUploadForm)} className="gap-2">
              <Plus className="w-4 h-4" />
              {showUploadForm ? 'Cancel' : 'Share New Material'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Materials Shared</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{myMaterials.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Views</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{totalViews}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Downloads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{totalDownloads}</div>
              </CardContent>
            </Card>
          </div>

          {/* Upload Form */}
          {showUploadForm && (
            <Card className="p-6 mb-8">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Upload New Material</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <Input
                    type="text"
                    placeholder="Material title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                    <Input
                      type="text"
                      placeholder="e.g., Mathematics"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">File Type</label>
                    <select
                      value={formData.fileType}
                      onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pdf">PDF</option>
                      <option value="pptx">PowerPoint</option>
                      <option value="doc">Document</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    placeholder="Describe the material content..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={uploadMutation.isPending} className="gap-2">
                    <Upload className="w-4 h-4" />
                    {uploadMutation.isPending ? 'Uploading...' : 'Share Material'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowUploadForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Materials List */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900">Your Materials ({myMaterials.length})</h3>
            {myMaterials.length === 0 ? (
              <Card className="p-12 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No materials shared yet</p>
                <p className="text-sm text-gray-400 mt-1">Share your first resource with students</p>
              </Card>
            ) : (
              myMaterials.map((material) => (
                <MaterialCard key={material.id} material={material} />
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
