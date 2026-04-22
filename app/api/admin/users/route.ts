import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { UserModel, type UserRole } from '@/lib/server/models/user';

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

export async function GET() {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  await connectToDatabase();
  const users = await UserModel.find({}).sort({ createdAt: -1 }).lean();

  return NextResponse.json({ users: users.map(serializeUser) });
}

export async function POST(request: Request) {
  const auth = await requireRoles(['admin']);
  if ('error' in auth) return auth.error;

  const body = await request.json().catch(() => null);
  const { name, email, role, password, status } = body || {};

  if (!name || !email || !role || !password) {
    return NextResponse.json({ error: 'name, email, role and password are required' }, { status: 400 });
  }

  if (!['student', 'teacher', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await UserModel.findOne({ email: String(email).toLowerCase() }).lean();
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(String(email))}`;
  const passwordHash = await bcrypt.hash(String(password), 10);

  const user = await UserModel.create({
    name: String(name),
    email: String(email).toLowerCase(),
    role: role as UserRole,
    passwordHash,
    status: status === 'inactive' ? 'inactive' : 'active',
    avatar,
  });

  return NextResponse.json({ user: serializeUser(user) }, { status: 201 });
}
