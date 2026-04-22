import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { DoubtModel } from '@/lib/server/models/doubt';
import { StudentProgressModel } from '@/lib/server/models/student-progress';
import { serializeDoubt } from '@/lib/server/serializers';

export async function GET() {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();
  const doubts = await DoubtModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ doubts: doubts.map(serializeDoubt) });
}

export async function POST(request: Request) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const { subject, question, description } = body || {};

  if (!subject || !question || !description) {
    return NextResponse.json({ error: 'subject, question and description are required' }, { status: 400 });
  }

  await connectToDatabase();

  const doubt = await DoubtModel.create({
    studentId: auth.user.id,
    studentName: auth.user.name,
    studentAvatar: auth.user.avatar || '',
    subject: String(subject),
    question: String(question),
    description: String(description),
    status: 'open',
    createdAt: new Date(),
    replies: [],
    upvotes: 0,
  });

  await StudentProgressModel.findOneAndUpdate(
    { userId: auth.user.id },
    {
      $setOnInsert: { userId: auth.user.id },
      $inc: { doubtsAsked: 1 },
    },
    { upsert: true }
  );

  return NextResponse.json({ doubt: serializeDoubt(doubt) }, { status: 201 });
}
