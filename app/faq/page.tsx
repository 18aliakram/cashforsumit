import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { getSession } from "@/lib/auth";
import { HelpCircle, ArrowRight } from "lucide-react";

export const revalidate = 0;

export default async function FAQPage() {
  const session = await getSession();

  const faqs = [
    {
      q: "How does selling my house work with Cash for Houses Summit?",
      a: "You submit basic property details and photos through our secure seller portal. Our underwriting team evaluates your submission and aims to provide a direct cash offer within 48 hours. If you accept, we coordinate closing according to your preferred timeline.",
    },
    {
      q: "How quickly can I receive an offer?",
      a: "We aim to provide an offer within 48 hours or less after receiving the necessary information to evaluate your property.",
    },
    {
      q: "Do I need to repair my house before submitting it?",
      a: "No. Properties can be considered in different conditions, including as-is. You do not need to perform expensive repairs or updates before submitting.",
    },
    {
      q: "Are there listing fees or real estate agent commissions?",
      a: "No. Selling directly to Cash for Houses Summit involves no listing fees, no agent commissions, and no seller contributions. The selling price agreed upon is net to the seller.",
    },
    {
      q: "Do I need a real estate agent to work with you?",
      a: "No. You can interact directly with our team through your private seller dashboard.",
    },
    {
      q: "What happens after I accept an offer?",
      a: "Once you accept an offer, our team assists with title search, escrow coordination, and establishing a flexible closing date.",
    },
    {
      q: "Can I communicate with your team online?",
      a: "Yes. Once registered, your seller portal includes a built-in messaging system so you can chat directly with our underwriting team.",
    },
    {
      q: "Can I change my mind or reject an offer?",
      a: "Yes. You are under no obligation to accept any offer. If you decline, you can continue the conversation with our team directly in the portal to discuss options.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow">
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Frequently Asked Questions
            </span>
            <h1 className="text-4xl font-bold text-brand-dark">Clear Answers for Homeowners & Buyers</h1>
            <p className="text-slate-600 text-sm max-w-xl mx-auto">
              Everything you need to know about our direct home buying process, offers, and properties.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <h3 className="text-lg font-bold text-brand-dark flex items-start gap-2.5">
                  <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-slate-600 text-sm pl-7 leading-relaxed">{faq.a}</p>
              </div>
            ))}

            <div className="bg-brand-dark text-white p-8 rounded-2xl text-center space-y-4 mt-12">
              <h3 className="text-xl font-bold">Have a Question Not Answered Here?</h3>
              <p className="text-slate-300 text-sm max-w-md mx-auto">
                Our team is standing by to answer your specific property questions.
              </p>
              <Link href="/contact" className="inline-block">
                <Button variant="primary" size="md">Contact Our Team</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
