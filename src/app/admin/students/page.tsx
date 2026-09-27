"use client";
import { useEffect, useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";

type Student={id:string;name:string;matricNo?:string;programme?:string;status?:string;email?:string};

async function action(action:string,payload:Record<string,unknown>={}) {
  const r=await fetch("/api/admin/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...payload})});
  const d=await r.json(); if(!r.ok) throw new Error(d.error||"Operation failed"); return d;
}

export default function AdminStudents(){
  const [students,setStudents]=useState<Student[]>([]),[loading,setLoading]=useState(true),[busy,setBusy]=useState(""),[show,setShow]=useState(false),[message,setMessage]=useState("");
  const [form,setForm]=useState({name:"",email:"",matricNo:"",programme:"",status:"Active"});
  async function load(){setLoading(true);try{const d=await action("list_students");setStudents(d.students||[])}catch(e){setMessage(e instanceof Error?e.message:"Could not load students")}finally{setLoading(false)}}
  useEffect(()=>{load()},[]);
  async function save(){if(!form.name||!form.email){setMessage("Name and email are required.");return}setBusy("save");try{await action("create_user",{user:{id:form.matricNo||undefined,fullName:form.name,email:form.email,role:"student",matricNo:form.matricNo,programme:form.programme,status:form.status},password:"ChangeMe123!"});setMessage("Student account created.");setShow(false);setForm({name:"",email:"",matricNo:"",programme:"",status:"Active"});await load()}catch(e){setMessage(e instanceof Error?e.message:"Create failed")}finally{setBusy("")}}
  async function changeStatus(s:Student,status:string){setBusy(s.id);try{await action("update_student_status",{studentId:s.id,matric_no:s.matricNo,status});await load()}catch(e){setMessage(e instanceof Error?e.message:"Update failed")}finally{setBusy("")}}
  return <PortalLayout role="admin" title="Student Administration"><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap"}}><div><h1 className="page-title">Students</h1><p className="muted">Create, inspect and update student records.</p></div><button className="btn btn-primary" onClick={()=>setShow(true)}>+ Add Student</button></div>
    {message&&<div className="card" style={{marginTop:16}}>{message}</div>}
    {show&&<div className="card" style={{marginTop:16}}><h2>Add student</h2><div className="grid grid-2"><input placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/><input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/><input placeholder="Matric number" value={form.matricNo} onChange={e=>setForm({...form,matricNo:e.target.value})}/><input placeholder="Programme" value={form.programme} onChange={e=>setForm({...form,programme:e.target.value})}/></div><div style={{marginTop:12,display:"flex",gap:8}}><button className="btn btn-primary" disabled={!!busy} onClick={save}>{busy==="save"?"Saving…":"Save Student"}</button><button className="btn" onClick={()=>setShow(false)}>Cancel</button></div></div>}
    <div className="card" style={{marginTop:20,overflowX:"auto"}}>{loading?<p>Loading students…</p>:<table><thead><tr><th>Name</th><th>Matric No</th><th>Programme</th><th>Status</th><th>Control</th></tr></thead><tbody>{students.map(s=><tr key={s.id}><td>{s.name}</td><td>{s.matricNo||"—"}</td><td>{s.programme||"—"}</td><td>{s.status||"Active"}</td><td><select disabled={busy===s.id} value={s.status||"Active"} onChange={e=>changeStatus(s,e.target.value)}><option>Active</option><option>Suspended</option><option>Pending</option><option>Graduated</option></select></td></tr>)}</tbody></table>}</div></PortalLayout>
}
