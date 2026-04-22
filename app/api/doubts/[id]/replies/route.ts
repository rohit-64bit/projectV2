import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { DoubtModel } from '@/lib/server/models/doubt';
import { serializeDoubt } from '@/lib/server/serializers';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const { content } = body || {};

  if (!content || typeof content !== 'string') {
    return NextResponse.json({ error: 'Reply content is required' }, { status: 400 });
  }

  await connectToDatabase();

  const { id } = await context.params;
  const doubt = await DoubtModel.findByIdAndUpdate(
    id,
    {
      $push: {
        replies: {
          authorId: auth.user.id,
          authorName: auth.user.name,
          authorAvatar: auth.user.avatar || '',
          content: content.trim(),
          createdAt: new Date(),
          isAccepted: false,
        },
      },
    },
    { new: true }
  ).lean();

  if (!doubt) {
    return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
  }

  return NextResponse.json({ doubt: serializeDoubt(doubt) }, { status: 201 });
}
