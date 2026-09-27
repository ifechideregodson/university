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
function upsert(entity:string,key:string,data:unknown){const now=new Date().toISOString();db.prepare(`INSERT INTO records(entity,record_key,data,created_at,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(entity,record_key) DO UPDATE SET data=excluded.data,updated_at=excluded.updated_at`).run(entity,key,JSON.stringify(data),now,now);}
function list(entity:string){return db.prepare("SELECT record_key,data,created_at,updated_at FROM records WHERE entity=? ORDER BY id DESC").all(entity).map((r:any)=>({id:r.record_key,...JSON.parse(r.data),createdAt:r.created_at,updatedAt:r.updated_at}));}

export async function callSqliteFallback(payload:Payload):Promise<any>{
 const action=String(payload.action||""); const actor=payload.actor||{}; const now=new Date().toISOString();
 const collections:any={lecturer_dashboard:["courses","assignments","materials","students"],admin_dashboard:["students","courses","admissions","payments"],student_dashboard:["course_registrations","results","payments"]};
 if(collections[action]){const out:any={source:"sqlite-fallback"}; for(const e of collections[action]) out[e]=list(e); return out;}
 if(action==="list_lecturer_courses") return {source:"sqlite-fallback",courses:list("courses")};
 if(action==="list_course_students"||action==="list_students") return {source:"sqlite-fallback",students:list("students")};
 if(action==="list_exam_attempts") return {source:"sqlite-fallback",attempts:list("exam_attempts")};
 if(action==="list_student_courses") return {source:"sqlite-fallback",courses:list("course_registrations")};
 if(action==="list_student_results") return {source:"sqlite-fallback",results:list("results")};
 if(action==="list_student_payments"||action==="list_payments") return {source:"sqlite-fallback",payments:list("payments")};
 const map:any={create_course:"courses",update_course:"courses",create_material:"materials",create_assignment:"assignments",create_exam:"exams",create_question:"questions",publish_result:"results",grade_assignment:"assignment_grades",initialize_payment:"payments"};
 if(map[action]){const keyName=action==="create_course"||action==="update_course"?"course":action.replace("create_","").replace("publish_","").replace("grade_","").replace("initialize_","");const data=(payload[keyName]||payload.result||payload.grade||payload.submission||payload.payment||{}) as Record<string,unknown>;const key=String(data.id||data.code||`${keyName}-${Date.now()}`);upsert(map[action],key,{...data,createdBy:actor,updatedAt:now});return {ok:true,source:"sqlite-fallback",id:key};}
 throw new Error(`SQLite fallback does not support action: ${action}`);
}
