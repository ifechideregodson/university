import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { callRetoolWorkflow } from "@/lib/retool";
const allowed = new Set(["student_dashboard","list_student_courses","list_student_results","list_student_payments","lecturer_dashboard","admin_dashboard","list_courses","list_students","list_exams","list_lecturer_courses","list_course_students"]);
export async function GET(request: Request) {
 try {
  const session=await getSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  const action=new URL(request.url).searchParams.get("action")||"";
  if(!allowed.has(action))return NextResponse.json({error:"Unsupported action"},{status:400});
  return NextResponse.json(await callRetoolWorkflow({action,actor:session}));
 } catch(error){return NextResponse.json({error:error instanceof Error?error.message:"Data request failed"},{status:500});}
}