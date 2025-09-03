
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      // cookie httpOnly olduğu için JS'te token yok; sadece yönlendir
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data?.error || "Giriş başarısız");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-6 rounded-md shadow">
        <h2 className="text-xl font-semibold mb-4">Admin Girişi</h2>

        <label className="block text-sm">Kullanıcı</label>
        <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full p-2 border rounded mb-3" />

        <label className="block text-sm">Parola</label>
        <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-4" />

        {error && <p className="text-sm text-red-600 mb-2">{error}</p>}

        <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded">Giriş</button>
      </form>
    </div>
  );
}
