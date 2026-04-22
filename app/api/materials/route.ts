import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { MaterialModel } from '@/lib/server/models/material';
import { serializeMaterial } from '@/lib/server/serializers';

export async function GET() {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();
  const materials = await MaterialModel.find({}).sort({ uploadedAt: -1 }).lean();

  return NextResponse.json({ materials: materials.map(serializeMaterial) });
}

export async function POST(request: Request) {
  const auth = await requireRoles(['teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const { title, subject, description, fileType, fileUrl } = body || {};

  if (!title || !subject || !description) {
    return NextResponse.json({ error: 'title, subject and description are required' }, { status: 400 });
  }

  await connectToDatabase();

  const material = await MaterialModel.create({
    title: String(title),
    subject: String(subject),
    description: String(description),
    uploadedBy: auth.user.id,
    uploadedByName: auth.user.name,
    uploadedAt: new Date(),
    fileType: fileType ? String(fileType) : 'pdf',
    fileUrl: fileUrl ? String(fileUrl) : '#',
    views: 0,
    downloads: 0,
  });

  return NextResponse.json({ material: serializeMaterial(material) }, { status: 201 });
}
