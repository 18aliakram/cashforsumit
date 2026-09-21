"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, CheckCircle2, DollarSign } from "lucide-react";

export function Hero3DCanvas() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const rotY = ((mouseX / rect.width) - 0.5) * 16;
    const rotX = ((mouseY / rect.height) - 0.5) * -16;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  return (
    <div className="perspective-1000 w-full max-w-xl mx-auto lg:max-w-none">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setRotateX(0);
          setRotateY(0);
        }}
        animate={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          scale: isHovered ? 1.015 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 22,
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative rounded-3xl bg-white border border-slate-200 shadow-2xl p-5 sm:p-6 text-brand-dark overflow-hidden transform-gpu"
      >
        {/* Soft Ambient Background Glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Property Image Showcase Canvas */}
        <div
          className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-100 shadow-sm"
          style={{ transform: "translateZ(20px)" }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
            alt="Minimalist 3D Property Showcase"
            fill
            sizes="700px"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

          {/* Top Pill Badge */}
          <div
            className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-slate-200 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-dark flex items-center gap-2 shadow-sm"
            style={{ transform: "translateZ(30px)" }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Direct Cash Valuation Engine</span>
          </div>
        </div>

        {/* Floating 3D Cash Offer Badge */}
        <div
          className="absolute top-1/2 -right-2 sm:-right-6 -translate-y-1/2 bg-white text-brand-dark p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-200 space-y-1 max-w-[220px]"
          style={{ transform: "translateZ(45px)" }}
        >
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-orange uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-brand-orange" />
            <span>Net Cash Offer</span>
          </div>
          <p className="text-2xl font-bold text-brand-dark">$345,000</p>
          <p className="text-[11px] text-slate-500 leading-tight">
            Zero Listing Fees • Flexible Closing
          </p>
        </div>

        {/* Bottom Verified Status Bar */}
        <div
          className="mt-4 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 text-xs"
          style={{ transform: "translateZ(25px)" }}
        >
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <span className="block font-semibold text-brand-dark">Underwriting Verified</span>
              <span className="text-[11px] text-slate-500">48-Hour Cash Guarantee</span>
            </div>
          </div>
          <span className="bg-brand-orange text-white font-semibold px-3 py-1 rounded-lg text-xs shadow-sm">
            Ready
          </span>
        </div>

      </motion.div>
    </div>
  );
}
