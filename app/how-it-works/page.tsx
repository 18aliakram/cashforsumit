import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth";
import { ArrowRight, CheckCircle2, FileText, Search, Award, MessageSquare, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function HowItWorksPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow">
        {/* Header */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Step-by-Step Overview
            </span>
            <h1 className="text-4xl font-bold text-brand-dark">How Cash for Houses Summit Works</h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
              Our direct home-buying platform is designed to eliminate traditional real-estate complexity.
            </p>
          </div>
        </section>

        {/* Steps Detailed */}
        <section className="py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-brand-dark">Tell Us About Your Property</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Create your secure seller account and complete our 5-step property wizard. You can submit basic specs, property condition, address, and upload photos directly from your phone or computer.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-brand-dark">We Review Your Home</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Our underwriting team reviews your submission alongside recent comparable market transactions. If needed, we will reach out via phone or inside your private portal for minor clarifications.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-brand-dark">Receive Your Cash Offer</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  We aim to provide an offer within 48 hours or less after receiving the information needed to evaluate your property. Your offer appears directly in your seller portal dashboard with complete pricing transparency.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                04
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-brand-dark">Choose What Works for You</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Take your time to evaluate the cash offer. You can accept the offer immediately or decline to request continued conversation with our team directly in the portal messaging center.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-orange text-white flex items-center justify-center font-black text-2xl flex-shrink-0">
                05
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-brand-dark">Close With Confidence</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  If you accept, our team assists in coordinating title, escrow, and closing according to a schedule that accommodates your timeline.
                </p>
              </div>
            </div>

            <div className="text-center pt-6">
              <Link href="/seller/submit-property">
                <Button variant="primary" size="lg" className="gap-2 px-8">
                  <span>Get Started Now</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
