import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/server/db';
import { requireRoles } from '@/lib/server/auth';
import { StudentProgressModel } from '@/lib/server/models/student-progress';

function defaultProgress(userId: string) {
  return {
    userId,
    totalLessonsCompleted: 0,
    averageScore: 0,
    currentStreak: 0,
    studyHoursThisWeek: 0,
    doubtsAsked: 0,
    materialsDownloaded: 0,
  };
}

export async function GET(_request: Request, context: { params: Promise<{ userId: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const { userId } = await context.params;

  if (auth.user.role === 'student' && auth.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  await connectToDatabase();

  const progress = await StudentProgressModel.findOneAndUpdate(
    { userId },
    { $setOnInsert: { userId } },
    { upsert: true, new: true }
  ).lean();

  if (!progress) {
    return NextResponse.json({ progress: defaultProgress(userId) });
  }

  return NextResponse.json({
    progress: {
      userId,
      totalLessonsCompleted: progress.totalLessonsCompleted,
      averageScore: progress.averageScore,
      currentStreak: progress.currentStreak,
      studyHoursThisWeek: progress.studyHoursThisWeek,
      doubtsAsked: progress.doubtsAsked,
      materialsDownloaded: progress.materialsDownloaded,
    },
  });
}

export async function PATCH(request: Request, context: { params: Promise<{ userId: string }> }) {
  const auth = await requireRoles(['student', 'teacher', 'admin']);
  if ('error' in auth) return auth.error;

  const { userId } = await context.params;

  if (auth.user.role === 'student' && auth.user.id !== userId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  await connectToDatabase();

  const progress = await StudentProgressModel.findOneAndUpdate(
    { userId },
    { $set: body, $setOnInsert: { userId } },
    { upsert: true, new: true }
  ).lean();

  return NextResponse.json({
    progress: {
      userId,
      totalLessonsCompleted: progress?.totalLessonsCompleted || 0,
      averageScore: progress?.averageScore || 0,
      currentStreak: progress?.currentStreak || 0,
      studyHoursThisWeek: progress?.studyHoursThisWeek || 0,
      doubtsAsked: progress?.doubtsAsked || 0,
      materialsDownloaded: progress?.materialsDownloaded || 0,
    },
  });
}
