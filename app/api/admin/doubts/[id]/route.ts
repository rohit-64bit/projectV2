import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { DoubtModel } from '@/lib/server/models/doubt';
import { serializeDoubt } from '@/lib/server/serializers';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id } = await context.params;
  await connectToDatabase();

  const doubt = await DoubtModel.findByIdAndUpdate(id, body, { new: true }).lean();

  if (!doubt) {
    return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
  }

  return NextResponse.json({ doubt: serializeDoubt(doubt) });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  const { id } = await context.params;
  await connectToDatabase();

  const doubt = await DoubtModel.findByIdAndDelete(id).lean();
  if (!doubt) {
    return NextResponse.json({ error: 'Doubt not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
