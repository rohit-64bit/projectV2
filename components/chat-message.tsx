import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  content: string;
  isAI?: boolean;
  userName: string;
  userAvatar: string;
  timestamp: Date;
}

export function ChatMessage({ content, isAI, userName, userAvatar, timestamp }: ChatMessageProps) {
  const timeString = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={cn('flex gap-3 mb-4', isAI && 'flex-row-reverse')}>
      <Avatar className="w-8 h-8 flex-shrink-0">
        <AvatarImage src={userAvatar} alt={userName} />
        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className={cn('flex-1 max-w-md', isAI && 'max-w-lg')}>
        <div className="flex items-baseline gap-2 mb-1">
          <p className="text-sm font-medium text-gray-900">{userName}</p>
          <p className="text-xs text-gray-500">{timeString}</p>
          {isAI && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">AI</span>}
        </div>
        <div
          className={cn(
            'px-4 py-2 rounded-lg text-sm',
            isAI
              ? 'bg-blue-50 text-gray-900 border border-blue-200'
              : 'bg-gray-100 text-gray-900'
          )}
        >
          <p className="whitespace-pre-wrap break-words">{content}</p>
        </div>
      </div>
    </div>
  );
}
