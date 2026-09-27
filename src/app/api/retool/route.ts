import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (session.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await request.json();
    return NextResponse.json(await callRetoolWorkflow({ ...body, actor: session }));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Retool request failed" },
      { status: 500 }
    );
  }
}
