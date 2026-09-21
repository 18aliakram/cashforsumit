"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process request.");

      setMessage(data.message);
      if (data.resetUrl) {
        setDevResetUrl(data.resetUrl);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-block">
          <div className="relative h-12 w-56 mx-auto">
            <Image src="/logo.png" alt="Logo" fill sizes="250px" className="object-contain" priority />
          </div>
        </Link>
        <h2 className="text-2xl font-bold text-brand-dark">Reset Your Password</h2>
        <p className="text-xs text-slate-500">
          Enter your registered seller email address and we&apos;ll send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl border border-slate-200 sm:rounded-2xl sm:px-10 space-y-6">
          
          {message ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-brand-dark">{message}</p>

              {devResetUrl && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left text-xs space-y-2">
                  <span className="font-bold text-slate-700 block">Development Quick Link:</span>
                  <a href={devResetUrl} className="text-brand-orange underline font-mono break-all block">
                    {devResetUrl}
                  </a>
                </div>
              )}

              <Link href="/login" className="inline-block pt-2">
                <Button variant="outline" size="md">Return to Login</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="seller@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2 mt-2">
                <span>Send Reset Link</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          )}

          <div className="text-center pt-2 text-xs">
            <Link href="/login" className="font-semibold text-slate-600 hover:text-brand-dark">
              ← Back to Seller Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
