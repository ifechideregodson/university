import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dataDir = process.env.SQLITE_DATA_DIR || path.join(process.cwd(), "data");
fs.mkdirSync(dataDir, { recursive: true });
const db = new Database(path.join(dataDir, "university.sqlite"));
db.pragma("journal_mode = WAL");
db.exec(`CREATE TABLE IF NOT EXISTS records (
id INTEGER PRIMARY KEY AUTOINCREMENT, entity TEXT NOT NULL, record_key TEXT NOT NULL,
data TEXT NOT NULL, created_at TEXT NOT NULL, updated_at TEXT NOT NULL,
UNIQUE(entity, record_key));
CREATE INDEX IF NOT EXISTS idx_records_entity ON records(entity);`);

type Payload = { action?: string; actor?: Record<string, unknown>; [key: string]: unknown };

function upsert(entity:string,key:string,data:unknown){
 const now=new Date().toISOString();
 db.prepare(`INSERT INTO records(entity,record_key,data,created_at,updated_at) VALUES(?,?,?,?,?)
 ON CONFLICT(entity,record_key) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at`)
 .run(entity,key,JSON.stringify(data),now,now);
}
function list(entity:string){
 return db.prepare("SELECT record_key,data,created_at,updated_at FROM records WHERE entity=? ORDER BY id DESC")
 .all(entity).map((r:any)=>({id:r.record_key,...JSON.parse(r.data),createdAt:r.created_at,updatedAt:r.updated_at}));
}
function seed(){
 const hasUsers=db.prepare("SELECT 1 FROM records WHERE entity='users' LIMIT 1").get();
 if(hasUsers) return;
 const now=new Date().toISOString();
 const seedUsers=[
  {id:"demo-student",email:"student@example.com",password:"student123",role:"student",fullName:"Demo Student"},
  {id:"demo-lecturer",email:"lecturer@example.com",password:"lecturer123",role:"lecturer",fullName:"Demo Lecturer"},
  {id:"demo-admin",email:"admin@example.com",password:"admin123",role:"admin",fullName:"Demo Admin"}
 ];
 const seedStudents=[{id:"stu-001",matricNo:"OU/2026/0001",name:"Demo Student",email:"student@example.com",programme:"Computer Science",level:100,status:"Active"}];
 const seedCourses=[
  {id:"csc101",code:"CSC101",title:"Introduction to Computer Science",unit:3,level:100,semester:"First"},
  {id:"csc201",code:"CSC201",title:"Data Structures",unit:3,level:200,semester:"First"},
  {id:"mat101",code:"MAT101",title:"Elementary Mathematics",unit:3,level:100,semester:"First"}
 ];
 const seedExams=[{id:"exam-001",courseId:"csc101",title:"CSC101 Mid-Semester Test",durationMinutes:30,published:true,questions:[]}];
 for(const u of seedUsers) upsert("users",u.id,u);
 for(const s of seedStudents) upsert("students",s.id,s);
 for(const c of seedCourses) upsert("courses",c.id,c);
 for(const e of seedExams) upsert("exams",e.id,e);
 upsert("course_registrations","demo-registration-1",{studentId:"demo-student",courseIds:["csc101","csc201","mat101"],status:"Registered"});
 upsert("academic_sessions","demo-session",{name:"2026/2027 Academic Session",semester:"First"});
}
seed();

export async function callSqliteFallback(payload:Payload):Promise<any>{
 const action=String(payload.action||""); const actor=payload.actor||{}; const now=new Date().toISOString();
 const collections:any={lecturer_dashboard:["courses","assignments","materials","students"],admin_dashboard:["students","courses","admissions","payments"],student_dashboard:["course_registrations","results","payments"]};
 if(collections[action]){
  const out:any={source:"sqlite-fallback"};
  if(action==="admin_dashboard"){
    const users=list("users"), students=list("students"), courses=list("courses"), admissions=list("admissions"), payments=list("payments"), sessions=list("academic_sessions");
    out.students=students.length;
    out.lecturers=users.filter((u:any)=>u.role==="lecturer").length;
    out.programmes=courses.length;
    out.pendingAdmissions=admissions.filter((a:any)=>String(a.status||"").toLowerCase()==="pending").length;
    out.session=sessions[0]||null;
    return out;
  }
  if(action==="student_dashboard"){
    const registrations=list("course_registrations").filter((r:any)=>String(r.studentId||"")===String(actor.id||""));
    const results=list("results").filter((r:any)=>String(r.studentId||"")===String(actor.id||""));
    const payments=list("payments").filter((p:any)=>String(p.studentId||"")===String(actor.id||""));
    const exams=list("exams").filter((e:any)=>e.published!==false);
    const student=list("students").find((s:any)=>String(s.email||"").toLowerCase()===String(actor.email||"").toLowerCase())||null;
    out.student=student;
    out.registeredCourses=(registrations[0]?.courseIds||[]).length;
    out.cgpa=results.length ? "—" : "—";
    out.upcomingExams=exams.length;
    out.outstandingFees=payments.filter((p:any)=>String(p.status||"").toLowerCase()!=="paid").reduce((sum:number,p:any)=>sum+Number(p.amount||0),0)||"₦0";
    return out;
  }
  if(action==="lecturer_dashboard"){
    const courses=list("courses"), assignments=list("assignments"), materials=list("materials"), students=list("students");
    out.assignedCourses=courses.length;
    out.students=students.length;
    out.pendingGrading=list("assignment_submissions").filter((s:any)=>String(s.status||"").toLowerCase()!=="graded").length;
    out.upcomingExams=list("exams").filter((e:any)=>e.published!==false).length;
    out.courses=courses; out.assignments=assignments; out.materials=materials;
    return out;
  }
  return out;
}
 if(action==="login_user"){
  const email=String(payload.email||"").toLowerCase();
  const password=String(payload.password||"");
  const user=list("users").find((u:any)=>String(u.email).toLowerCase()===email&&u.password===password);
  return {source:"sqlite-fallback",user:user||null};
 }
 if(["list_courses","list_lecturer_courses"].includes(action)) return {source:"sqlite-fallback",courses:list("courses")};
 if(["list_students","list_course_students"].includes(action)) return {source:"sqlite-fallback",students:list("students")};
 if(action==="list_exams") return {source:"sqlite-fallback",exams:list("exams")};
 if(action==="list_exam_attempts") return {source:"sqlite-fallback",attempts:list("exam_attempts")};
 if(action==="list_student_courses") return {source:"sqlite-fallback",courses:list("course_registrations")};
 if(action==="list_student_results") return {source:"sqlite-fallback",results:list("results")};
 if(action==="list_student_payments"||action==="list_payments") return {source:"sqlite-fallback",payments:list("payments")};
 if(action==="register_courses"){
  const key=`registration-${String(payload.studentId||actor.id||"student")}-${Date.now()}`;
  upsert("course_registrations",key,{studentId:payload.studentId||actor.id,courseIds:payload.courseIds,sessionId:payload.sessionId,semesterId:payload.semesterId,status:"Registered"});
  return {ok:true,source:"sqlite-fallback",id:key};
 }
 if(action==="submit_exam"){
  const key=`attempt-${String(payload.studentId||actor.id||"student")}-${Date.now()}`;
  upsert("exam_attempts",key,{studentId:payload.studentId||actor.id,examId:payload.examId,answers:payload.answers,submittedAt:now});
  return {ok:true,source:"sqlite-fallback",id:key};
 }
 const map:any={create_course:"courses",update_course:"courses",create_material:"materials",create_assignment:"assignments",create_exam:"exams",create_question:"questions",publish_result:"results",grade_assignment:"assignment_grades",initialize_payment:"payments"};
 if(map[action]){
  const keyName=action==="create_course"||action==="update_course"?"course":action.replace("create_","").replace("publish_","").replace("grade_","").replace("initialize_","");
  const data=(payload[keyName]||payload.result||payload.grade||payload.submission||payload.payment||{}) as Record<string,unknown>;
  const key=String(data.id||data.code||`${keyName}-${Date.now()}`);
  upsert(map[action],key,{...data,createdBy:actor,updatedAt:now});
  return {ok:true,source:"sqlite-fallback",id:key};
 }
 throw new Error(`SQLite fallback does not support action: ${action}`);
}
