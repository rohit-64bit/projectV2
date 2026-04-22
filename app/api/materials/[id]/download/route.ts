import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { MaterialModel } from '@/lib/server/models/material';

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();

  const { id } = await context.params;
  const material = await MaterialModel.findByIdAndUpdate(
    id,
    { $inc: { downloads: 1 } },
    { new: true }
  ).lean();

  if (!material) {
    return NextResponse.json({ error: 'Material not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
