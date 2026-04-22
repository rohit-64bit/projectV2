import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { MaterialModel } from '@/lib/server/models/material';
import { serializeMaterial } from '@/lib/server/serializers';

export async function GET() {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();
  const materials = await MaterialModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ materials: materials.map(serializeMaterial) });
}
