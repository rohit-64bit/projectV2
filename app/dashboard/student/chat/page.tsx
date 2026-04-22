'use client';

import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { Sidebar } from '@/components/sidebar';
import { ChatMessage } from '@/components/chat-message';
import { useAuth } from '@/lib/auth-context';
import { useChat, useSendMessage } from '@/hooks/use-data';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, Send, TrendingUp, BookOpen } from 'lucide-react';

const CLASS_ID = 'general-class'; // Default class for now

export default function ChatPage() {
  const { user } = useAuth();
  const { data: messages = [] } = useChat(CLASS_ID);
  const sendMessageMutation = useSendMessage(CLASS_ID);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');

    try {
      // Send user message
      await sendMessageMutation.mutateAsync({
        userId: user?.id || '',
        userName: user?.name || 'Student',
        userAvatar: user?.avatar || '',
        content: userMessage,
      });

      // Simulate AI response after a delay
      setTimeout(() => {
        sendMessageMutation.mutate({
          userId: 'ai-assistant',
          userName: 'AI Assistant',
          userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai',
          content: generateAIResponse(userMessage),
          isAI: true,
        });
      }, 1000);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <main className="lg:ml-64 flex-1 flex flex-col pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Chat with AI Assistant</h1>
            <p className="text-gray-600 mt-2">Ask questions about your studies anytime</p>
          </div>

          {/* Chat Container */}
          <Card className="flex-1 flex flex-col mb-6 overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <MessageCircle className="w-12 h-12 text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">Start a conversation</p>
                  <p className="text-sm text-gray-400 mt-1">Ask the AI assistant anything about your studies</p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      content={message.content}
                      userName={message.userName}
                      userAvatar={message.userAvatar}
                      timestamp={message.timestamp}
                      isAI={message.isAI}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white">
              <div className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Ask me anything..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={sendMessageMutation.isPending}
                  className="flex-1"
                />
                <Button
                  type="submit"
                  disabled={!input.trim() || sendMessageMutation.isPending}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send
                </Button>
              </div>
            </form>
          </Card>

          {/* Quick Questions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Tips for better help</h3>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Ask specific questions about topics</li>
                <li>• Provide context about your problem</li>
                <li>• Follow up with clarifications if needed</li>
                <li>• Practice what you learn</li>
              </ul>
            </Card>
            <Card className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Common topics</h3>
              <div className="space-y-2">
                {['Mathematics', 'Science', 'History', 'Languages'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setInput(`Help me with ${topic}`)}
                    className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    → {topic}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

// Simple AI response generator
function generateAIResponse(userMessage: string): string {
  const responses: { [key: string]: string } = {
    math: 'Math is all about understanding patterns and relationships. Let me help you break down the concept step by step.',
    science: 'Science is about observing the world and understanding how things work. What specific topic would you like to explore?',
    history: 'History helps us understand how past events shape our present. Can you be more specific about which period or event?',
    help: 'I\'m here to help! Feel free to ask any question about your studies, and I\'ll do my best to explain it clearly.',
    default: 'That\'s a great question! Let me help you understand this better. Could you provide more context or details?',
  };

  const lowerMessage = userMessage.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  return responses.default;
}
