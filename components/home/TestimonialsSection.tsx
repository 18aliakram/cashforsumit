"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Star, Quote, CheckCircle2, MapPin, Clock, DollarSign } from "lucide-react";
import { Card3D } from "@/components/ui/Card3D";

const TESTIMONIALS = [
  {
    id: 1,
    name: "Marcus & Elena Vance",
    location: "Austin, TX",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    saleDetails: "Sold in 12 days • $345,000 Net Cash",
    rating: 5,
    quote:
      "We needed to sell our property quickly without going through month-long open houses and agent fee negotiations. Cash for Houses Summit evaluated our home in 24 hours and paid exactly what they offered.",
    tag: "Verified Homeowner",
  },
  {
    id: 2,
    name: "Sarah Jenkins",
    location: "Denver, CO",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80",
    saleDetails: "Sold As-Is • $489,000 Net Cash",
    rating: 5,
    quote:
      "The house required roof work and interior updates that we didn't want to fund out-of-pocket. Cash for Houses Summit bought it as-is. The direct messaging portal kept us updated every step of the way.",
    tag: "Verified Homeowner",
  },
  {
    id: 3,
    name: "David & Carol Miller",
    location: "Charlotte, NC",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    saleDetails: "Sold in 14 days • $298,000 Net Cash",
    rating: 5,
    quote:
      "Selling directly eliminated real estate agent commissions entirely. We set our own closing date to match our relocation schedule. Transparent, honest, and direct.",
    tag: "Verified Homeowner",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-[#FAFAFA] to-white relative overflow-hidden">
      
      {/* Background Decorative Blur Orbs */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange-light px-3.5 py-1.5 rounded-full border border-brand-orange/20">
            <Star className="w-3.5 h-3.5 fill-brand-orange" />
            <span>Success Stories & Reviews</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight">
            Real Homeowners. Real Cash Offers.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            See how homeowners nationwide skip traditional listing uncertainty, commissions, and repairs by selling directly to Summit.
          </p>
        </div>

        {/* Testimonials 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
            >
              <Card3D className="h-full">
                <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-lg hover:shadow-2xl transition-shadow flex flex-col justify-between space-y-6 h-full relative overflow-hidden">
                  
                  <Quote className="w-10 h-10 text-brand-orange/15 absolute top-6 right-6 pointer-events-none" />

                  {/* Stars & Sale Tag */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-400 gap-1">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>{t.tag}</span>
                      </span>
                    </div>

                    <div className="p-3 bg-[#FAFAFA] rounded-xl border border-slate-100 text-xs font-semibold text-brand-dark flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-brand-orange flex-shrink-0" />
                      <span>{t.saleDetails}</span>
                    </div>
                  </div>

                  {/* Quote Body */}
                  <p className="text-slate-600 text-sm leading-relaxed italic">
                    &quot;{t.quote}&quot;
                  </p>

                  {/* Author Profile */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-brand-orange/30 flex-shrink-0">
                      <Image src={t.avatar} alt={t.name} fill sizes="50px" className="object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-brand-dark">{t.name}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-brand-orange" />
                        <span>{t.location}</span>
                      </p>
                    </div>
                  </div>

                </div>
              </Card3D>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
