import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { DoubtModel } from '@/lib/server/models/doubt';
import { serializeDoubt } from '@/lib/server/serializers';

export async function GET() {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();
  const doubts = await DoubtModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ doubts: doubts.map(serializeDoubt) });
}
