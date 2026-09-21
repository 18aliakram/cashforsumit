import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyFilterCatalog } from "@/components/properties/PropertyFilterCatalog";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

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
    lotSize: "0.45 Acres (19,602 sqft)",
    propertyType: "Single Family",
    yearBuilt: 2018,
    description: "Modern home featuring custom hardwood cabinetry and energy-efficient HVAC.",
    features: JSON.stringify(["Gourmet Kitchen", "Quartz Countertops", "Dual Primary Suites", "Smart Thermostat"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Forced Air", cooling: "Central Air" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80" }],
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
    yearBuilt: 2021,
    description: "Contemporary Craftsman featuring cedar accents and radiant heated floors.",
    features: JSON.stringify(["Mountain Views", "Radiant Floor Heating", "EV Charger Ready"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Radiant Floor Heating" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80" }],
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
    yearBuilt: 1995,
    description: "Classic brick architecture with contemporary interior upgrades.",
    features: JSON.stringify(["Hardwood Flooring", "Fenced Backyard", "Updated Roof (2023)"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Forced Air" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80" }],
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
    yearBuilt: 2022,
    description: "Breathtaking waterfront estate with resort-style swimming pool and private boat dock.",
    features: JSON.stringify(["Private Boat Dock", "Inground Pool", "Summer Kitchen"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Central Heat Pump" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80" }],
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
    lotSize: "N/A (Condo)",
    propertyType: "Condo",
    yearBuilt: 2019,
    description: "Sleek downtown penthouse loft with 18-foot soaring ceilings and skyline city views.",
    features: JSON.stringify(["High Ceilings", "Skyline City Views", "Open Floorplan"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Electric Heat Pump" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80" }],
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
    yearBuilt: 2017,
    description: "Spacious family residence in prime school district featuring an inground saltwater pool.",
    features: JSON.stringify(["Inground Saltwater Pool", "Screened Patio", "Fenced Yard"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Forced Air" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80" }],
  },
];

export default async function PropertiesPage() {
  const session = await getSession();

  let initialProperties: any[] = [];
  try {
    initialProperties = await db.property.findMany({
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("[Properties Page Error]", error);
  }

  if (initialProperties.length === 0) {
    initialProperties = FALLBACK_PROPERTIES;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-brand-orange uppercase tracking-wider bg-brand-orange-light px-3.5 py-1.5 rounded-full border border-brand-orange/20">
              Direct Property Catalog
            </span>
            <h1 className="text-4xl font-extrabold text-brand-dark tracking-tight">Available Homes For Sale</h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Explore residential properties purchased directly by Cash for Houses Summit. Filter by location, price, specifications, or status.
            </p>
          </div>

          <PropertyFilterCatalog initialProperties={initialProperties} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
