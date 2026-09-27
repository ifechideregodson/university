import { NextResponse } from 'next/server';
import { callRetoolWorkflow } from '@/lib/retool';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.fullName || !body.email || !body.password || !body.role) return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    if (!['student','lecturer'].includes(body.role)) return NextResponse.json({ error: 'Only student and lecturer self-registration is allowed' }, { status: 400 });
    if (String(body.password).length < 8) return NextResponse.json({ error: 'Password must contain at least 8 characters' }, { status: 400 });
    return NextResponse.json(await callRetoolWorkflow({ action: 'register_user', user: { fullName: body.fullName, email: body.email, role: body.role }, password: body.password }), { status: 201 });
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Registration failed' }, { status: 500 }); }
}
