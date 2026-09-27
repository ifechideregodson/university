import { NextResponse } from "next/server";
import { callRetoolWorkflow } from "@/lib/retool";
export async function POST(request:Request){const body=await request.json();if(!body.fullName||!body.email||!body.programme)return NextResponse.json({error:"Full name, email and programme are required"},{status:400});try{return NextResponse.json(await callRetoolWorkflow({action:"submit_admission",application:body}));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Admission workflow unavailable"},{status:502});}}
