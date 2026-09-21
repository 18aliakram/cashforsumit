import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin, Shield, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#181A1C] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Column 1 & 2: Logo & Company Story */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <div className="relative h-10 w-48 overflow-hidden bg-white/10 p-1.5 rounded-lg border border-white/10">
                <Image
                  src="/logo.png"
                  alt="Cash for Houses Summit Logo"
                  fill
                  sizes="200px"
                  className="object-contain object-left px-1"
                />
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              Cash for Houses Summit has been buying residential homes directly from homeowners since 2011.
              Our nationwide platform provides simple, transparent cash offers in 48 hours or less with zero listing fees.
            </p>
            <div className="pt-2 flex items-center space-x-4 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-brand-orange" /> Direct Buyer
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-brand-orange" /> Secure Seller Portal
              </span>
            </div>
          </div>

          {/* Column 3: Explore */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/properties" className="hover:text-brand-orange transition-colors">
                  Buy a House
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-brand-orange transition-colors">
                  Available Properties
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-brand-orange transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-orange transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-brand-orange transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Sell */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Sell Your Home
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/sell-your-home" className="hover:text-brand-orange transition-colors">
                  Sell Your Home
                </Link>
              </li>
              <li>
                <Link href="/seller/submit-property" className="hover:text-brand-orange transition-colors">
                  Submit Property
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-orange transition-colors">
                  Seller Portal Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-brand-orange transition-colors">
                  Create Seller Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Contact & Support
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span>(800) 555-0199</span>
              </li>
              <li className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-brand-orange flex-shrink-0" />
                <span className="truncate">contact@cashforhousessummit.com</span>
              </li>
              <li className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0 mt-0.5" />
                <span>Nationwide Platform Service & Direct Operations</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Legal & Discreet Admin Link */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Cash for Houses Summit. All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/faq" className="hover:text-slate-200 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/faq" className="hover:text-slate-200 transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/faq" className="hover:text-slate-200 transition-colors">
              Accessibility
            </Link>
            <Link href="/contact" className="hover:text-slate-200 transition-colors">
              Contact
            </Link>
            {/* Discreet Admin Portal Link */}
            <Link
              href="/admin/login"
              className="text-slate-500 hover:text-slate-300 transition-colors border-l border-slate-700 pl-4"
            >
              Admin Portal
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
