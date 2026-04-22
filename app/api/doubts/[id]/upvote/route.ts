import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { DoubtModel } from '@/lib/server/models/doubt';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();

  const { id } = await context.params;
  const doubt = await DoubtModel.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { new: true }).lean();

  if (!doubt) {
    return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true, upvotes: doubt.upvotes });
}
