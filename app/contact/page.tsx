import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "./ContactForm";
import { getSession } from "@/lib/auth";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export const revalidate = 0;

export default async function ContactPage() {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
              Get In Touch
            </span>
            <h1 className="text-4xl font-bold text-brand-dark">Contact Cash for Houses Summit</h1>
            <p className="text-slate-600 text-sm">
              Have questions about selling your home, receiving a cash offer, or exploring available properties? Send us a message below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Contact Details */}
            <div className="lg:col-span-5 space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <h3 className="text-xl font-bold text-brand-dark">Direct Support Info</h3>
                
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-brand-dark">Toll-Free Phone</span>
                      <span className="text-slate-600">(800) 555-0199</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-brand-dark">Email Support</span>
                      <span className="text-slate-600">contact@cashforhousessummit.com</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-brand-dark">Service Area</span>
                      <span className="text-slate-600">Nationwide Residential Home Buying Platform</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-brand-orange flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="block font-semibold text-brand-dark">Business Hours</span>
                      <span className="text-slate-600">Mon – Fri: 8:00 AM – 7:00 PM EST</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-7">
              <ContactForm />
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
