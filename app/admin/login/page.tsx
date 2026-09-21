"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { ShieldCheck, Lock, Mail, KeyRound } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@cashforhousessummit.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Admin authentication failed");

      if (data.user.role !== "ADMIN") {
        throw new Error("Access restricted to authorized Admin accounts only.");
      }

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#111315] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-4">
        
        {/* Admin Badge */}
        <div className="w-12 h-12 rounded-2xl bg-brand-orange/20 text-brand-orange border border-brand-orange/30 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-bold tracking-tight text-white">
          Admin Operations Portal
        </h2>
        <p className="text-xs text-slate-400">
          Restricted management interface for Cash for Houses Summit administrators.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#1E2022] py-8 px-6 shadow-2xl border border-slate-800 sm:rounded-2xl sm:px-10 space-y-6">
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111315] border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#111315] border border-slate-700 rounded-lg text-sm text-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                />
              </div>
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2 mt-2">
              <KeyRound className="w-4 h-4" />
              <span>Authenticate Session</span>
            </Button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Default Admin Credentials:</p>
            <p className="font-mono text-[11px] bg-[#111315] p-2 rounded border border-slate-800">
              admin@cashforhousessummit.com / admin123
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
