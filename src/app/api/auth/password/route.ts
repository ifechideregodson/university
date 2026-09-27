import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { callRetoolWorkflow } from '@/lib/retool';

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    if (!body.currentPassword || !body.newPassword || String(body.newPassword).length < 8) return NextResponse.json({ error: 'Valid password values are required' }, { status: 400 });
    const result = await callRetoolWorkflow({ action: 'change_password', actor: session, currentPassword: body.currentPassword, newPassword: body.newPassword });
    return NextResponse.json(result);
  } catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Password change failed' }, { status: 500 }); }
}
