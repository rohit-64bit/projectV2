import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, ThumbsUp, Clock } from 'lucide-react';
import { Doubt } from '@/lib/mock-data';

interface DoubtCardProps {
  doubt: Doubt;
  isTeacher?: boolean;
}

export function DoubtCard({ doubt, isTeacher }: DoubtCardProps) {
  const timeAgo = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const getStatusColor = (status: Doubt['status']) => {
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
    <Link href={`/student/doubts/${doubt.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex gap-4">
          {/* Avatar */}
          <Avatar className="w-10 h-10 flex-shrink-0">
            <AvatarImage src={doubt.studentAvatar} alt={doubt.studentName} />
            <AvatarFallback>{doubt.studentName.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <p className="text-sm font-medium text-gray-900">{doubt.studentName}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3" />
                  {timeAgo(new Date(doubt.createdAt))}
                </p>
              </div>
              <Badge className={getStatusColor(doubt.status)} variant="secondary">
                {doubt.status}
              </Badge>
            </div>

            <div className="mb-3">
              <h3 className="font-medium text-gray-900 line-clamp-2">{doubt.question}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mt-1">{doubt.description}</p>
            </div>

            {/* Subject and Stats */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {doubt.subject}
              </Badge>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <ThumbsUp className="w-3 h-3" />
                  {doubt.upvotes}
                </div>
                <div className="flex items-center gap-1">
                  <MessageCircle className="w-3 h-3" />
                  {doubt.replies.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
