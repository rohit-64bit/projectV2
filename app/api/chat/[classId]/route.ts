import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { ChatMessageModel } from '@/lib/server/models/chat-message';
import { serializeChatMessage } from '@/lib/server/serializers';
import { generateStudyAssistantReply } from '@/lib/server/gemini';

export async function GET(_request: Request, context: { params: Promise<{ classId: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();

  const { classId } = await context.params;
  const messages = await ChatMessageModel.find({ classId }).sort({ timestamp: 1 }).lean();

  return NextResponse.json({ messages: messages.map(serializeChatMessage) });
}

export async function POST(request: Request, context: { params: Promise<{ classId: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const { content } = body || {};

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Message content is required' }, { status: 400 });
  }

  await connectToDatabase();

  const { classId } = await context.params;

  const userMessage = await ChatMessageModel.create({
    classId,
    userId: auth.user.id,
    userName: auth.user.name,
    userAvatar: auth.user.avatar || '',
    content: content.trim(),
    isAI: false,
    timestamp: new Date(),
  });

  const aiReplyText = await generateStudyAssistantReply(content.trim());

  await ChatMessageModel.create({
    classId,
    userId: 'ai-assistant',
    userName: 'AI Assistant',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ai-assistant',
    content: aiReplyText,
    isAI: true,
    timestamp: new Date(),
  });

  return NextResponse.json({ message: serializeChatMessage(userMessage) }, { status: 201 });
}
