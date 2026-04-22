'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { useCreateDoubt } from '@/hooks/use-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrendingUp, BookOpen, MessageCircle, ArrowLeft } from 'lucide-react';

export default function NewDoubtPage() {
  const router = useRouter();
  const createDoubtMutation = useCreateDoubt();
  const [formData, setFormData] = useState({
    subject: '',
    question: '',
    description: '',
  });

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

  const subjects = ['Mathematics', 'Science', 'History', 'Languages', 'Programming', 'Other'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.subject || !formData.question || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      await createDoubtMutation.mutateAsync({
        subject: formData.subject,
        question: formData.question,
        description: formData.description,
      });

      router.push('/dashboard/student/doubts');
    } catch (error) {
      console.error('Failed to create doubt:', error);
      alert('Failed to create doubt');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doubts
          </button>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
            <p className="text-gray-600 mt-2">
              Ask your doubt and get help from teachers and the community
            </p>
          </div>

          {/* Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>New Question</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a subject</option>
                    {subjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Question Title */}
                <div>
                  <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    Question Title
                  </label>
                  <Input
                    id="question"
                    type="text"
                    placeholder="What is your question?"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Be specific and clear about your question</p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    placeholder="Provide more details about your question. Include what you've tried so far."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    The more details you provide, the better help you'll receive
                  </p>
                </div>

                {/* Tips */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Tips for a good question:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use a clear, descriptive title</li>
                    <li>• Explain what you&apos;ve already tried</li>
                    <li>• Provide relevant context or examples</li>
                    <li>• Check if similar questions exist first</li>
                  </ul>
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                  <Button
                    type="submit"
                    disabled={createDoubtMutation.isPending}
                    className="flex-1"
                  >
                    {createDoubtMutation.isPending ? 'Posting...' : 'Post Question'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
