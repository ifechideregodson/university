import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
export async function GET(){return NextResponse.json({user:verifySession((await cookies()).get("ou_session")?.value)});}
