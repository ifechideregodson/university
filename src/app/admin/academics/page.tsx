"use client";

import { useEffect, useState } from "react";
import { PortalLayout } from "@/components/PortalLayout";

type AcademicRecord = { id:string; type?:string; faculty?:string; department?:string; programme?:string; level?:number|string; name?:string; semester?:string; status?:string };

export default function AdminAcademics() {
  const [items,setItems]=useState<AcademicRecord[]>([]);
  const [sessions,setSessions]=useState<AcademicRecord[]>([]);
  const [loading,setLoading]=useState(true);
  const [notice,setNotice]=useState("");
  const [error,setError]=useState("");
  const [form,setForm]=useState({type:"programme",faculty:"",department:"",programme:"",level:"100"});
  const [sessionForm,setSessionForm]=useState({name:"2026/2027 Academic Session",semester:"First"});

  async function load(){
    setLoading(true); setError("");
    try{
      const [a,b]=await Promise.all([fetch("/api/data?action=list_academic_structure"),fetch("/api/data?action=list_academic_sessions")]);
      const structure=await a.json(); const academicSessions=await b.json();
      if(!a.ok) throw new Error(structure.error||"Unable to load academic structure");
      if(!b.ok) throw new Error(academicSessions.error||"Unable to load academic sessions");
      setItems(structure.items||[]); setSessions(academicSessions.sessions||[]);
    }catch(e){setError(e instanceof Error?e.message:"Unable to load academic data")}
    finally{setLoading(false)}
  }
  useEffect(()=>{load()},[]);

  async function save(action:string, body:Record<string,unknown>, success:string){
    setNotice(""); setError("");
    try{
      const r=await fetch("/api/admin/action",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action,...body})});
      const d=await r.json(); if(!r.ok) throw new Error(d.error||"Save failed");
      setNotice(success); await load();
    }catch(e){setError(e instanceof Error?e.message:"Save failed")}
  }

  return <PortalLayout role="admin" title="Academic Structure">
    <div className="page-head"><div><h1 className="page-title">Academic Management</h1><p className="muted">Manage faculties, departments, programmes, levels, sessions and semesters.</p></div><button className="button secondary" onClick={load} disabled={loading}>Refresh</button></div>
    {notice&&<div className="card" style={{marginBottom:16}}><p>{notice}</p></div>}
    {error&&<div className="card" style={{marginBottom:16}}><p className="error">{error}</p></div>}
    <div className="grid-2">
      <form className="card" onSubmit={e=>{e.preventDefault();save("create_academic_structure",{record:{...form,level:Number(form.level)}},"Academic structure saved.");}}>
        <h2>Academic Structure</h2><p className="muted">Create a faculty, department or programme record.</p>
        <label>Record type<select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="faculty">Faculty</option><option value="department">Department</option><option value="programme">Programme</option></select></label>
        <label>Faculty<input value={form.faculty} onChange={e=>setForm({...form,faculty:e.target.value})} placeholder="Faculty of Computing"/></label>
        <label>Department<input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="Computer Science"/></label>
        <label>Programme<input value={form.programme} onChange={e=>setForm({...form,programme:e.target.value})} placeholder="B.Sc. Computer Science"/></label>
        <label>Level<input type="number" min="100" step="100" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}/></label>
        <button className="button" type="submit">Save Academic Structure</button>
      </form>
      <form className="card" onSubmit={e=>{e.preventDefault();save("create_academic_session",{session:{...sessionForm,status:"Active"}},"Academic session saved.");}}>
        <h2>Academic Session</h2><p className="muted">Create the session and semester used by registration and results.</p>
        <label>Session<input value={sessionForm.name} onChange={e=>setSessionForm({...sessionForm,name:e.target.value})} required/></label>
        <label>Semester<select value={sessionForm.semester} onChange={e=>setSessionForm({...sessionForm,semester:e.target.value})}><option>First</option><option>Second</option><option>Summer</option></select></label>
        <button className="button" type="submit">Save Academic Session</button>
      </form>
    </div>
    <div className="card" style={{marginTop:20}}><h2>Academic Structure Records</h2><p className="muted">{loading?"Loading...":items.length+" record(s)"}</p>
      <div className="table-wrap"><table><thead><tr><th>Faculty</th><th>Department</th><th>Programme</th><th>Level</th><th>Type</th></tr></thead><tbody>
        {items.length?items.map(i=><tr key={i.id}><td>{i.faculty||"—"}</td><td>{i.department||"—"}</td><td>{i.programme||"—"}</td><td>{i.level||"—"}</td><td>{i.type||"—"}</td></tr>):<tr><td colSpan={5} className="muted">No academic structure records yet.</td></tr>}
      </tbody></table></div>
    </div>
    <div className="card" style={{marginTop:20}}><h2>Academic Sessions</h2>
      <div className="table-wrap"><table><thead><tr><th>Session</th><th>Semester</th><th>Status</th></tr></thead><tbody>
        {sessions.length?sessions.map(s=><tr key={s.id}><td>{s.name||"—"}</td><td>{s.semester||"—"}</td><td>{s.status||"Active"}</td></tr>):<tr><td colSpan={3} className="muted">No sessions yet.</td></tr>}
      </tbody></table></div>
    </div>
  </PortalLayout>;
}
