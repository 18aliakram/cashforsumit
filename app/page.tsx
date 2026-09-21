import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card3D } from "@/components/ui/Card3D";
import { Hero3DCanvas } from "@/components/home/Hero3DCanvas";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import {
  ArrowRight,
  CheckCircle2,
  DollarSign,
  Clock,
  ShieldCheck,
  Home,
  Bed,
  Bath,
  Square,
  Sparkles,
  HelpCircle,
  Building2,
  Users,
  Search,
} from "lucide-react";

export const revalidate = 0;

const FALLBACK_PROPERTIES = [
  {
    id: "prop-1",
    title: "Modern Colonial Residence in Fairview Heights",
    slug: "modern-colonial-fairview-heights",
    price: 345000,
    address: "1428 Elmwood Terrace",
    city: "Austin",
    state: "TX",
    zip: "78704",
    bedrooms: 4,
    bathrooms: 3.5,
    squareFeet: 2850,
    lotSize: "0.45 Acres",
    propertyType: "Single Family",
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" }],
  },
  {
    id: "prop-2",
    title: "Contemporary Craftsman with Mountain Views",
    slug: "craftsman-mountain-views",
    price: 489000,
    address: "882 Timberline Ridge",
    city: "Denver",
    state: "CO",
    zip: "80202",
    bedrooms: 3,
    bathrooms: 2.5,
    squareFeet: 2320,
    lotSize: "0.38 Acres",
    propertyType: "Single Family",
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }],
  },
  {
    id: "prop-3",
    title: "Refined Brick Tudor in Historic District",
    slug: "refined-brick-tudor",
    price: 298000,
    address: "415 Oakmont Lane",
    city: "Charlotte",
    state: "NC",
    zip: "28203",
    bedrooms: 3,
    bathrooms: 2.0,
    squareFeet: 1940,
    lotSize: "0.28 Acres",
    propertyType: "Single Family",
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80" }],
  },
  {
    id: "prop-4",
    title: "Luxury Waterfront Villa & Private Dock",
    slug: "luxury-waterfront-villa",
    price: 625000,
    address: "104 Ocean View Boulevard",
    city: "Miami",
    state: "FL",
    zip: "33139",
    bedrooms: 5,
    bathrooms: 4.0,
    squareFeet: 3400,
    lotSize: "0.50 Acres",
    propertyType: "Single Family",
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80" }],
  },
  {
    id: "prop-5",
    title: "Architectural Modern Loft in Downtown",
    slug: "architectural-modern-loft",
    price: 395000,
    address: "520 Pine Street #8B",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    bedrooms: 2,
    bathrooms: 2.0,
    squareFeet: 1650,
    lotSize: "N/A",
    propertyType: "Condo",
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80" }],
  },
  {
    id: "prop-6",
    title: "Suburban Family Haven with Swimming Pool",
    slug: "suburban-family-haven",
    price: 412000,
    address: "245 Peachtree Ridge",
    city: "Atlanta",
    state: "GA",
    zip: "30305",
    bedrooms: 4,
    bathrooms: 3.0,
    squareFeet: 2600,
    lotSize: "0.40 Acres",
    propertyType: "Single Family",
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80" }],
  },
];

export default async function HomePage() {
  const session = await getSession();

  let featuredProperties: any[] = [];
  try {
    featuredProperties = await db.property.findMany({
      where: { status: "AVAILABLE" },
      include: { images: { orderBy: { sortOrder: "asc" } } },
      take: 6,
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    featuredProperties = [];
  }

  if (featuredProperties.length === 0) {
    featuredProperties = FALLBACK_PROPERTIES;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow">
        
        {/* 1. HERO SECTION */}
        <section className="relative py-16 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-[#FAFAFA] to-slate-50/90 overflow-hidden border-b border-slate-200/80">
          <div className="absolute top-12 left-1/4 w-96 h-96 bg-brand-orange/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-12 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-brand-orange-light text-brand-orange text-sm font-bold px-4 py-2 rounded-full border border-brand-orange/20 shadow-sm mx-auto lg:mx-0">
                  <Sparkles className="w-4 h-4 fill-brand-orange" />
                  <span>Direct Home Buyer & 3D Property Platform</span>
                </div>

                <h1 className="text-4xl sm:text-6xl lg:text-[68px] font-extrabold text-brand-dark tracking-tight leading-[1.12]">
                  Sell your house with confidence. <br className="hidden sm:inline" />
                  <span className="text-brand-orange font-extrabold">
                    Buy your next home with clarity.
                  </span>
                </h1>

                <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                  Cash for Houses Summit buys homes directly from homeowners nationwide. Receive a transparent cash offer within 48 hours with zero listing fees, or explore available homes for sale.
                </p>

                <div className="pt-3 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href="/seller/submit-property" className="w-full sm:w-auto">
                    <Button variant="primary" size="lg" className="w-full gap-2 px-9 py-4 text-lg font-bold shadow-lg">
                      <span>Get My Instant Offer</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>

                  <Link href="/properties" className="w-full sm:w-auto">
                    <Button variant="outline" size="lg" className="w-full gap-2 px-9 py-4 text-lg font-bold border-slate-300">
                      <Search className="w-5 h-5 text-brand-orange" />
                      <span>Browse Available Homes</span>
                    </Button>
                  </Link>
                </div>

                <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-sm sm:text-base font-semibold text-slate-700">
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Established 2011</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>Zero Listing Fees</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center lg:justify-start">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>48-Hour Cash Offer</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <Hero3DCanvas />
              </div>

            </div>
          </div>
        </section>

        {/* 2. TRUST BAR */}
        <section className="py-10 bg-brand-dark text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-sm sm:text-base font-bold uppercase tracking-wider divide-x divide-slate-800">
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-brand-orange block">2011</span>
                <span className="text-slate-400 text-xs">Established Operations</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-white block">48 Hours</span>
                <span className="text-slate-400 text-xs">Offer Turnaround</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-brand-orange block">$0</span>
                <span className="text-slate-400 text-xs">Agent Commissions</span>
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-white block">100%</span>
                <span className="text-slate-400 text-xs">Direct Purchase</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. FEATURED AVAILABLE PROPERTIES SECTION (6 DEMO PROPERTIES - RIGHT ABOVE TWO DIRECT OPTIONS) */}
        {featuredProperties.length > 0 && (
          <section className="py-24 bg-[#FAFAFA] border-b border-slate-200/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange-light px-3.5 py-1.5 rounded-full border border-brand-orange/20">
                    Direct Available Catalog
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark mt-2">Available Properties For Sale</h2>
                </div>
                <Link href="/properties">
                  <Button variant="outline" size="sm" className="gap-2 font-semibold text-sm">
                    <span>View All 6 Properties</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProperties.map((prop) => (
                  <Card3D key={prop.id}>
                    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all group flex flex-col justify-between h-full">
                      
                      <div className="relative h-60 w-full overflow-hidden bg-slate-900">
                        <Image
                          src={prop.images?.[0]?.url || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"}
                          alt={prop.title}
                          fill
                          sizes="400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-4 left-4">
                          <Badge status={prop.status}>{prop.status}</Badge>
                        </div>
                      </div>

                      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-brand-orange uppercase">{prop.propertyType}</span>
                            <span className="text-2xl font-extrabold text-brand-dark">{formatCurrency(prop.price)}</span>
                          </div>
                          <h3 className="font-bold text-xl text-brand-dark line-clamp-1">{prop.title}</h3>
                          <p className="text-xs text-slate-500">{prop.address}, {prop.city} {prop.state}</p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs sm:text-sm text-slate-700 font-semibold">
                          <div className="flex items-center justify-center gap-1">
                            <Bed className="w-4 h-4 text-brand-orange" />
                            <span>{prop.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Bath className="w-4 h-4 text-brand-orange" />
                            <span>{prop.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center justify-center gap-1">
                            <Square className="w-4 h-4 text-brand-orange" />
                            <span>{formatNumber(prop.squareFeet)} sqft</span>
                          </div>
                        </div>

                        <Link href={`/properties/${prop.slug}`} className="block pt-2">
                          <Button variant="primary" size="md" className="w-full gap-2 font-bold">
                            <span>View Property Details</span>
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </Link>
                      </div>

                    </div>
                  </Card3D>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 4. 3D TWO PATHS SECTION */}
        <section className="py-24 bg-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange-light px-4 py-1.5 rounded-full border border-brand-orange/20">
                Two Direct Options
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark">How Cash for Houses Summit Works For You</h2>
              <p className="text-slate-600 text-lg">Choose whether you are selling a house directly or searching for your next residential property.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Path 1: Sell */}
              <Card3D>
                <div className="bg-[#FAFAFA] p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6 flex flex-col justify-between h-full hover:border-brand-orange transition-colors">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-brand-orange/10 text-brand-orange flex items-center justify-center font-bold">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">For Homeowners</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Sell Your House Directly</h3>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                      Submit basic details and photos to receive an evaluation and direct cash offer in 48 hours or less. Zero agent commissions, no open houses, and as-is purchase terms.
                    </p>
                    <ul className="space-y-2 text-sm sm:text-base text-slate-700 font-semibold pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> No listing fees or hidden charges</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Flexible closing timeline (14 to 60 days)</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Sell in as-is condition without repairs</li>
                    </ul>
                  </div>
                  <Link href="/seller/submit-property" className="pt-4 block">
                    <Button variant="primary" size="lg" className="w-full gap-2 text-base font-bold py-4">
                      <span>Submit Your Home</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </Card3D>

              {/* Path 2: Buy */}
              <Card3D>
                <div className="bg-[#FAFAFA] p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-lg space-y-6 flex flex-col justify-between h-full hover:border-blue-500 transition-colors">
                  <div className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                      <Home className="w-8 h-8" />
                    </div>
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">For Buyers</span>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark">Explore Available Homes</h3>
                    <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                      Browse our curated catalog of available residential properties with complete spec breakdowns, high-res photos, and direct acquisition options.
                    </p>
                    <ul className="space-y-2 text-sm sm:text-base text-slate-700 font-semibold pt-2">
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Direct property acquisition options</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Complete spec disclosures & photos</li>
                      <li className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-blue-600" /> Fast inquiry turnaround & tours</li>
                    </ul>
                  </div>
                  <Link href="/properties" className="pt-4 block">
                    <Button variant="outline" size="lg" className="w-full gap-2 text-base font-bold py-4 border-slate-300">
                      <span>Browse Property Catalog</span>
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                </div>
              </Card3D>

            </div>
          </div>
        </section>

        {/* 5. 3D 5-STEP PROCESS TIMELINE */}
        <section className="py-24 bg-gradient-to-b from-[#FAFAFA] to-white border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange-light px-3.5 py-1.5 rounded-full border border-brand-orange/20">
                Simple & Transparent
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark">Our 5-Step Purchase Process</h2>
              <p className="text-slate-600 text-base sm:text-lg">Designed to eliminate traditional real estate complexity from submission to closing.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {[
                { step: "01", title: "Submit Details", desc: "Complete our interactive questionnaire with property specs & photos." },
                { step: "02", title: "Underwriting", desc: "Our team analyzes local comps and property condition." },
                { step: "03", title: "Cash Offer", desc: "Receive an offer in your portal within 48 hours or less." },
                { step: "04", title: "Decide & Discuss", desc: "Accept the offer or continue negotiations with our team." },
                { step: "05", title: "Close & Collect", desc: "Choose your preferred closing date and finalize paperwork." },
              ].map((item) => (
                <Card3D key={item.step} className="h-full">
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md space-y-3 h-full flex flex-col justify-between hover:border-brand-orange transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-brand-dark">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </Card3D>
              ))}
            </div>

          </div>
        </section>

        {/* 6. HOMEOWNER TESTIMONIALS / REVIEWS SECTION */}
        <TestimonialsSection />

        {/* 7. FAQ ACCORDION SECTION */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Clear Guidance</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  q: "How does selling directly to Cash for Houses Summit work?",
                  a: "You complete our online questionnaire with property specs and photos. Our underwriting team evaluates your home against recent comparable market data and aims to issue a cash offer within 48 hours or less.",
                },
                {
                  q: "Are there any real estate agent fees or listing commissions?",
                  a: "No. Selling directly to Cash for Houses Summit involves zero listing fees, zero agent commissions, and no seller closing contributions. The agreed purchase price is net cash to you.",
                },
                {
                  q: "Do I need to repair my house before submitting it?",
                  a: "No. We evaluate homes in as-is condition. You do not need to perform expensive repairs or updates before submitting.",
                },
              ].map((faq, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#FAFAFA] border border-slate-200 space-y-2">
                  <h3 className="font-bold text-base sm:text-lg text-brand-dark flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-brand-orange flex-shrink-0" />
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-sm text-slate-600 pl-7 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <Link href="/faq">
                <Button variant="outline" size="md" className="font-semibold">View All Frequently Asked Questions</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 8. FINAL HIGH-CONVERSION CTA */}
        <section className="py-20 bg-brand-dark text-white text-center">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            <h2 className="text-3xl sm:text-5xl font-extrabold">Ready to Receive Your Direct Cash Offer?</h2>
            <p className="text-slate-300 text-lg max-w-xl mx-auto leading-relaxed">
              Complete our interactive questionnaire to get your property evaluated in 48 hours or less.
            </p>
            <Link href="/seller/submit-property" className="inline-block">
              <Button variant="primary" size="lg" className="px-9 py-4 text-lg font-bold gap-2 shadow-2xl">
                <span>Start Your Home Submission</span>
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
