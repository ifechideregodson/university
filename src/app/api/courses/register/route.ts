import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
export async function POST(request:Request){const s=verifySession((await cookies()).get("ou_session")?.value);if(!s||s.role!=="student")return NextResponse.json({error:"Student authentication required"},{status:401});const body=await request.json();if(!Array.isArray(body.courseIds)||!body.courseIds.length)return NextResponse.json({error:"Select at least one course"},{status:400});try{return NextResponse.json(await callRetoolWorkflow({action:"register_courses",studentId:s.id,courseIds:body.courseIds,sessionId:body.sessionId,semesterId:body.semesterId}));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Registration workflow unavailable"},{status:502});}}
