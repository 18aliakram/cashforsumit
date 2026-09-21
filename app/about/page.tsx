import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth";
import { ArrowRight, ShieldCheck, Building2, Users, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AboutPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow">
        <section className="py-20 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Company History
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark">Buying Homes Since 2011</h1>
            <p className="text-slate-600 text-base max-w-2xl mx-auto leading-relaxed">
              Cash for Houses Summit has built its process around making home selling straightforward, transparent, and direct for homeowners nationwide.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-4 text-slate-700 text-sm leading-relaxed">
                <h2 className="text-2xl font-bold text-brand-dark">Our Core Purpose</h2>
                <p>
                  We’ve been buying homes since 2011 for the real estate industry. Our nationwide website platform gives homeowners a quick offer for their home in 48 hours or less after evaluating the necessary property information.
                </p>
                <p>
                  Traditional home sales often involve agent commissions, uncertain financing, multiple weekend open houses, and repair negotiations. We built Cash for Houses Summit to provide a direct alternative: Submit, Review, Offer, Decide, and Close.
                </p>
              </div>

              <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg border border-slate-200">
                <Image
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80"
                  alt="Real Estate Technology"
                  fill
                  sizes="500px"
                  className="object-cover"
                />
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h3 className="text-xl font-bold text-brand-dark text-center">Core Platform Principles</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                <div className="space-y-2 p-4 bg-[#FAFAFA] rounded-xl">
                  <ShieldCheck className="w-8 h-8 text-brand-orange mx-auto" />
                  <h4 className="font-bold text-brand-dark">Transparency</h4>
                  <p className="text-xs text-slate-600">No hidden listing fees or unexpected seller contributions.</p>
                </div>
                <div className="space-y-2 p-4 bg-[#FAFAFA] rounded-xl">
                  <Building2 className="w-8 h-8 text-brand-orange mx-auto" />
                  <h4 className="font-bold text-brand-dark">Direct Purchase</h4>
                  <p className="text-xs text-slate-600">Work directly with our team without middleman layers.</p>
                </div>
                <div className="space-y-2 p-4 bg-[#FAFAFA] rounded-xl">
                  <Users className="w-8 h-8 text-brand-orange mx-auto" />
                  <h4 className="font-bold text-brand-dark">Seller Control</h4>
                  <p className="text-xs text-slate-600">Accept, reject, or negotiate offers at your pace.</p>
                </div>
              </div>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
