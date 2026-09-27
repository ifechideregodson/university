import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
const ACTIONS=new Set(["list_students","list_admissions","approve_admission","reject_admission","create_course","update_course","publish_result","list_payments","create_announcement","create_user","update_student_status"]);
export async function POST(request:NextRequest){const session=await getSession();if(!session||session.role!=="admin")return NextResponse.json({error:"Admin access required"},{status:403});const body=await request.json().catch(()=>null);if(!body?.action||!ACTIONS.has(body.action))return NextResponse.json({error:"Unsupported admin action"},{status:400});try{return NextResponse.json(await callRetoolWorkflow({...body,actor:session}));}catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Request failed"},{status:502});}}
