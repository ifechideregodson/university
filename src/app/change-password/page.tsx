"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const router = useRouter();
  const [currentPassword,setCurrentPassword]=useState(""),[newPassword,setNewPassword]=useState(""),[confirm,setConfirm]=useState(""),[error,setError]=useState(""),[loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setError("");if(newPassword!==confirm){setError("The new passwords do not match.");return}setLoading(true);try{const r=await fetch("/api/auth/change-password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword,newPassword})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Could not change password");router.push("/"+d.user.role);router.refresh()}catch(e){setError(e instanceof Error?e.message:"Could not change password")}finally{setLoading(false)}}
  return <div className="content"><form className="card form" onSubmit={submit}><h1 className="page-title">Set your password</h1><p className="muted">This is your first sign-in. Replace the temporary password supplied by the university with your own password.</p><label className="label">Temporary password</label><input className="input" type="password" value={currentPassword} onChange={e=>setCurrentPassword(e.target.value)} required/><label className="label">New password</label><input className="input" type="password" minLength={8} value={newPassword} onChange={e=>setNewPassword(e.target.value)} required/><label className="label">Confirm new password</label><input className="input" type="password" minLength={8} value={confirm} onChange={e=>setConfirm(e.target.value)} required/>{error&&<p>{error}</p>}<button className="btn btn-primary" style={{width:"100%"}} disabled={loading}>{loading?"Saving…":"Set password"}</button></form></div>;
}
