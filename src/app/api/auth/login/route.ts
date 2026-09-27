import { NextResponse } from 'next/server';
import { signSession } from '@/lib/auth';
import { callRetoolWorkflow } from '@/lib/retool';

const demo = new Map([
  ['student@example.com', { password: 'student123', id: 'demo-student', role: 'student' as const, name: 'Demo Student' }],
  ['lecturer@example.com', { password: 'lecturer123', id: 'demo-lecturer', role: 'lecturer' as const, name: 'Demo Lecturer' }],
  ['admin@example.com', { password: 'admin123', id: 'demo-admin', role: 'admin' as const, name: 'Demo Admin' }],
]);

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  try {
    let user: any = null;
    try { user = await callRetoolWorkflow({ action: 'login_user', email, password }); } catch {}
    const d = demo.get(String(email).toLowerCase());
    if (!user?.user && d && d.password === password) user = { user: { id:d.id, role:d.role, fullName:d.name, email } };
    const u = user?.user;
    if (!u) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    const session = { id: u.id, role: u.role, name: u.fullName || u.name, email: u.email || email };
    const res = NextResponse.json({ user: session });
    res.cookies.set('ou_session', signSession(session), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: 60*60*24*7 });
    return res;
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Login failed' }, { status: 500 });
  }
}
