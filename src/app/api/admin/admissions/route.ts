import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
export async function POST(request:NextRequest){const session=await getSession();if(!session||session.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});const body=await request.json().catch(()=>null);if(!body?.action||!["list_admissions","approve_admission","reject_admission"].includes(body.action))return NextResponse.json({error:"Invalid admission action"},{status:400});try{return NextResponse.json(await callRetoolWorkflow({...body,actor:session}));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Workflow failed"},{status:502});}}
