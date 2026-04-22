import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { connectToDatabase } from './db';
import { UserModel, type UserRole } from './models/user';

export const AUTH_COOKIE_NAME = 'bf_auth';

type JwtPayload = {
  sub: string;
  role: UserRole;
  email: string;
  name: string;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  return secret;
}

export function signAuthToken(payload: JwtPayload) {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
}

export function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: '',
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return null;
  }

  try {
    const payload = verifyAuthToken(token);
    await connectToDatabase();
    const user = await UserModel.findById(payload.sub).lean();
    if (!user || user.status !== 'active') {
      return null;
    }

    return {
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      institution: user.institution,
      department: user.department,
      status: user.status,
      createdAt: user.createdAt,
    };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }
  return { user };
}

export async function requireRoles(roles: UserRole[]) {
  const auth = await requireUser();
  if ('error' in auth) {
    return auth;
  }

  if (!roles.includes(auth.user.role)) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return auth;
}
