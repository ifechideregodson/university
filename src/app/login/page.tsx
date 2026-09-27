"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("student@example.com");
  const [password, setPassword] = useState("student123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const d = await r.json();

    if (!r.ok) {
      setError(d.error || "Login failed");
      setLoading(false);
      return;
    }

    router.push(params.get("next") || `/${d.user.role}`);
    router.refresh();
  }

  return (
    <div className="content">
      <form className="card form" onSubmit={submit}>
        <h1 className="page-title">Sign in</h1>
        <label className="label">Email</label>
        <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        <label className="label">Password</label>
        <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p>{error}</p>}
        <button className="btn btn-primary" style={{ width: "100%" }} disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense
      fallback={
        <div className="content">
          <div className="card">
            <p className="muted">Loading sign in…</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
