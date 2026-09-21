import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth";
import { ArrowRight, CheckCircle2, DollarSign, Clock, ShieldCheck, Home } from "lucide-react";

export const revalidate = 0;

export default async function SellYourHomePage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="inline-block text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange-light px-3.5 py-1.5 rounded-full">
              Direct Home Buyer Since 2011
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark tracking-tight">
              Thinking About Selling Your House?
            </h1>
            <p className="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Tell us about your property and our underwriting team will review the details to evaluate a direct cash offer with zero listing fees.
            </p>
            <div className="pt-4">
              <Link href="/seller/submit-property">
                <Button variant="primary" size="lg" className="gap-2.5 px-8 shadow-md">
                  <span>Start Your Property Submission</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h2 className="text-3xl font-bold text-brand-dark">Why Homeowners Sell Directly To Us</h2>
              <p className="text-slate-600 text-sm">
                Understand your offer clearly without traditional listing-related costs or uncertainty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                  <DollarSign className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">No Listing Fees</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Skip traditional listing commissions and broker fees. Selling price is net to seller without hidden costs.
                </p>
              </div>

              <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                  <Home className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">Sell As-Is Condition</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Your property does not need to look perfect before you talk to us. Homes in different conditions can be considered.
                </p>
              </div>

              <div className="bg-[#FAFAFA] p-8 rounded-2xl border border-slate-200 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark">Flexible Closing</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Work directly with our team to discuss a timeline that fits your specific moving schedule and situation.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 bg-brand-dark text-white">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
            <h2 className="text-3xl font-bold">Ready to Receive Your Offer?</h2>
            <p className="text-slate-300 text-sm max-w-xl mx-auto">
              Create your secure seller account, submit basic details and photos, and track everything online.
            </p>
            <Link href="/seller/submit-property" className="inline-block">
              <Button variant="primary" size="lg" className="gap-2">
                <span>Submit Your Home Details</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
