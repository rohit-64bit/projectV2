import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { DoubtModel } from '@/lib/server/models/doubt';
import { serializeDoubt } from '@/lib/server/serializers';

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();
  const { id } = await context.params;
  const doubt = await DoubtModel.findById(id).lean();

  if (!doubt) {
    return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
  }

  return NextResponse.json({ doubt: serializeDoubt(doubt) });
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const { status } = body || {};

  if (!status || !['open', 'answered', 'closed'].includes(status)) {
    return NextResponse.json({ error: 'Valid status is required' }, { status: 400 });
  }

  await connectToDatabase();

  const { id } = await context.params;
  const doubt = await DoubtModel.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).lean();

  if (!doubt) {
    return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
  }

  return NextResponse.json({ doubt: serializeDoubt(doubt) });
}
