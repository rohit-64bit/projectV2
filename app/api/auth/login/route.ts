import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { setAuthCookie, signAuthToken } from '@/lib/server/auth';
import { UserModel } from '@/lib/server/models/user';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const { email, password, role } = body || {};

  if (!email || !password || !role) {
    return NextResponse.json({ error: 'Email, password and role are required' }, { status: 400 });
  }

  await connectToDatabase();

  const user = await UserModel.findOne({ email: String(email).toLowerCase() });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  const isPasswordValid = await bcrypt.compare(String(password), user.passwordHash);
  if (!isPasswordValid || user.role !== role) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
  }

  if (user.status !== 'active') {
    return NextResponse.json({ error: 'User is inactive' }, { status: 403 });
  }

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
