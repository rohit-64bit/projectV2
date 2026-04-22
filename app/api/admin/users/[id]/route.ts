import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { UserModel } from '@/lib/server/models/user';

function serializeUser(user: any) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    status: user.status,
    institution: user.institution,
    department: user.department,
    joinDate: user.createdAt,
  };
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const { id } = await context.params;

  const updates: Record<string, unknown> = {};

  if (body.name) updates.name = String(body.name);
  if (body.email) updates.email = String(body.email).toLowerCase();
  if (body.role && ['student', 'teacher', 'admin'].includes(body.role)) updates.role = body.role;
  if (body.status && ['active', 'inactive'].includes(body.status)) updates.status = body.status;
  if (body.password) updates.passwordHash = await bcrypt.hash(String(body.password), 10);

  await connectToDatabase();
  const user = await UserModel.findByIdAndUpdate(id, updates, { new: true }).lean();

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ user: serializeUser(user) });
}

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  const { id } = await context.params;

  await connectToDatabase();

  if (id === auth.user.id) {
    return NextResponse.json({ error: 'Admin cannot delete self' }, { status: 400 });
  }

  const deleted = await UserModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
