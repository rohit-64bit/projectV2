'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { useDoubt, useReplyToDoubt, useUpdateDoubtStatus, useUpvoteDoubt } from '@/hooks/use-data';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, BookOpen, MessageCircle, ArrowLeft, ThumbsUp, Check } from 'lucide-react';

export default function DoubtDetailPage() {
  const params = useParams();
  const router = useRouter();
  const doubtId = params.id as string;
  const { user } = useAuth();
  const { data: doubt } = useDoubt(doubtId);
  const replyMutation = useReplyToDoubt(doubtId);
  const upvoteMutation = useUpvoteDoubt(doubtId);
  const updateStatusMutation = useUpdateDoubtStatus(doubtId);
  const [replyText, setReplyText] = useState('');

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

  if (!doubt) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <Sidebar items={sidebarItems} />
        <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <p className="text-gray-500">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      await replyMutation.mutateAsync({
        authorId: user?.id || '',
        authorName: user?.name || 'Student',
        authorAvatar: user?.avatar || '',
        content: replyText,
      });
      setReplyText('');
    } catch (error) {
      console.error('Failed to add reply:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800';
      case 'answered':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar items={sidebarItems} />

      <main className="lg:ml-64 pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Doubts
          </button>

          {/* Question Card */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex gap-4 flex-1">
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={doubt.studentAvatar} alt={doubt.studentName} />
                    <AvatarFallback>{doubt.studentName.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="font-medium text-gray-900">{doubt.studentName}</h2>
                    <p className="text-sm text-gray-500">
                      {new Date(doubt.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className={getStatusColor(doubt.status)} variant="secondary">
                  {doubt.status}
                </Badge>
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">{doubt.question}</h1>
              <div className="flex items-center gap-2 mb-4">
                <Badge variant="outline">{doubt.subject}</Badge>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-gray-700 leading-relaxed mb-6">{doubt.description}</p>

              <div className="flex items-center gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => upvoteMutation.mutate()}
                  className="gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {doubt.upvotes}
                </Button>

                {user?.role === 'teacher' && doubt.status === 'open' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateStatusMutation.mutate('answered')}
                    className="gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Mark Answered
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Replies Section */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Replies ({doubt.replies.length})
            </h3>

            {doubt.replies.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p>No replies yet. Be the first to help!</p>
              </Card>
            ) : (
              <div className="space-y-4 mb-6">
                {doubt.replies.map((reply) => (
                  <Card key={reply.id} className="p-4">
                    <div className="flex gap-4">
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage src={reply.authorAvatar} alt={reply.authorName} />
                        <AvatarFallback>{reply.authorName.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">{reply.authorName}</h4>
                          {reply.isAccepted && (
                            <Badge variant="secondary" className="text-xs">
                              Accepted
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 mb-2">
                          {new Date(reply.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-700">{reply.content}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Reply Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Your Reply</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleReply} className="space-y-4">
                <textarea
                  placeholder="Share your answer or helpful insight..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={4}
                />
                <Button type="submit" disabled={!replyText.trim() || replyMutation.isPending}>
                  {replyMutation.isPending ? 'Posting...' : 'Post Reply'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
