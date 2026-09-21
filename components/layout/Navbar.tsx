"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  userSession?: {
    userId: string;
    role: "SELLER" | "ADMIN";
    firstName: string;
  } | null;
}

export function Navbar({ userSession }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Buy a House", href: "/properties" },
    { name: "Sell Your Home", href: "/sell-your-home" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3"
          : "bg-white border-b border-slate-100 py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* LEFT: Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-11 w-44 sm:w-52 overflow-hidden transition-transform duration-200 group-hover:scale-[1.01]">
              <Image
                src="/logo.png"
                alt="Cash for Houses Summit Logo"
                fill
                sizes="(max-width: 768px) 180px, 220px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* CENTER: Main Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    active
                      ? "text-brand-orange bg-brand-orange-light font-semibold"
                      : "text-slate-700 hover:text-brand-dark hover:bg-slate-100/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: Contact, Auth, Primary CTA */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/contact"
              className="text-sm font-medium text-slate-700 hover:text-brand-dark transition-colors px-2 py-1"
            >
              Contact Us
            </Link>

            {userSession ? (
              <Link
                href={userSession.role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard"}
                className="inline-flex items-center gap-2 text-sm font-medium text-brand-dark bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-lg transition-colors border border-slate-200"
              >
                {userSession.role === "ADMIN" ? (
                  <ShieldCheck className="w-4 h-4 text-brand-orange" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                )}
                <span>Dashboard ({userSession.firstName})</span>
              </Link>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-slate-700 hover:text-brand-dark transition-colors px-2 py-1"
              >
                Log In
              </Link>
            )}

            <Link href="/seller/submit-property">
              <Button variant="primary" size="md" className="gap-2">
                <span>Get Your Cash Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-2">
            <Link href="/seller/submit-property">
              <Button variant="primary" size="sm" className="text-xs px-3">
                Cash Offer
              </Button>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-brand-dark rounded-md hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(link.href)
                    ? "bg-brand-orange-light text-brand-orange font-semibold"
                    : "text-slate-800 hover:bg-slate-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
            >
              Contact Us
            </Link>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {userSession ? (
              <Link
                href={userSession.role === "ADMIN" ? "/admin/dashboard" : "/seller/dashboard"}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full text-center px-4 py-3 rounded-lg text-sm font-semibold bg-slate-100 text-brand-dark border border-slate-200"
              >
                Dashboard ({userSession.firstName})
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full px-4 py-3 rounded-lg text-sm font-semibold bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200"
              >
                Log In
              </Link>
            )}

            <Link
              href="/seller/submit-property"
              onClick={() => setMobileMenuOpen(false)}
              className="block"
            >
              <Button variant="primary" size="lg" className="w-full justify-center gap-2">
                <span>Get Your Cash Offer</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
