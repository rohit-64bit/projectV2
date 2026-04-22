import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { setAuthCookie, signAuthToken } from '@/lib/server/auth';
import { UserModel, type UserRole } from '@/lib/server/models/user';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { name, email, password, role } = body || {};

  if (!name || !email || !password || !role) {
    return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
  }

  if (!['student', 'teacher', 'admin'].includes(role)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
  }

  await connectToDatabase();

  const existing = await UserModel.findOne({ email: String(email).toLowerCase() }).lean();
  if (existing) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(String(password), 10);
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(String(email))}`;

  const user = await UserModel.create({
    name: String(name),
    email: String(email).toLowerCase(),
    passwordHash,
    role: role as UserRole,
    avatar,
  });

  const response = NextResponse.json({
    user: {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      institution: user.institution,
      department: user.department,
      status: user.status,
      createdAt: user.createdAt,
    },
  });

  const token = signAuthToken({
    sub: String(user._id),
    role: user.role,
    email: user.email,
    name: user.name,
  });

  setAuthCookie(response, token);
  return response;
}
