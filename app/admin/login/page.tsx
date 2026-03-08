"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push("/admin");
    } else {
      const d = await res.json();
      setError(d.error || "Ошибка входа");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0a0a1a" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-amber-500 mb-4 text-white font-bold text-2xl">
            НМ
          </div>
          <h1 className="text-2xl font-bold text-white">Панель управления</h1>
          <p className="text-gray-500 text-sm mt-1">Наталья Мельхер</p>
        </div>

        <form onSubmit={handleSubmit}
          className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur space-y-6">
          <div className="h-1 bg-gradient-to-r from-purple-500 to-amber-500 rounded-full -mt-8 -mx-8 mb-8 rounded-b-none" />

          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-400 mb-2">Пароль</label>
            <input
              type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-sm"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-amber-600 text-white font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
            {loading ? "Вход..." : "Войти"}
          </button>
        </form>

        <p className="text-center text-gray-600 text-xs mt-6">
          Только для автора сайта
        </p>
      </div>
    </div>
  );
}
