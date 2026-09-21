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
    description:
      "An exquisitely designed modern home featuring open-concept living spaces, custom hardwood cabinetry, energy-efficient HVAC, and an expansive landscaped private backyard. Direct purchase through Cash for Houses Summit.",
    features: JSON.stringify([
      "Gourmet Kitchen",
      "Quartz Countertops",
      "Dual Primary Suites",
      "Covered Patio",
      "Two-Car Garage",
      "Smart Thermostat",
      "Walk-In Closets",
      "Central Air",
      "Gas Fireplace",
      "EV Charger Ready",
    ]),
    detailedSpecs: JSON.stringify({
      interior: {
        heating: "Forced Air, Heat Pump",
        cooling: "Central Air, Ceiling Fan(s)",
        appliances: "Electric Range, Dishwasher, Refrigerator, Microwave, Disposal, Washer, Dryer",
        laundry: "Main Level Laundry Room, Hookups",
        flooring: "Hardwood, Tile, Carpet",
        fireplace: "1 Fireplace (Gas Log, Living Room)",
        basement: "Partial, Finished Rec Room",
      },
      parking: {
        totalSpaces: 3,
        garageType: "Attached Garage (2 Spaces), Carport",
        features: "Oversized, EV Charger Ready",
      },
      construction: {
        style: "Contemporary Colonial",
        materials: "Brick, HardiePlank Siding",
        roof: "Architectural Composition Shingle",
        stories: "2 Stories",
      },
      utilities: {
        gas: "Natural Gas Available",
        electric: "City Electric (Xcel)",
        water: "Public City Water",
        sewer: "Public Sewer",
        greenEnergy: "Energy Star Double-Pane Windows, Smart Thermostat",
      },
    }),
    status: "AVAILABLE",
    featured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: "Photo 1" },
      { url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80", alt: "Photo 2" },
      { url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80", alt: "Photo 3" },
    ],
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
    description:
      "Stunning contemporary Craftsman featuring cedar accents, oversized black-framed windows, radiant heated floors, and unobstructed views of the Front Range mountains.",
    features: JSON.stringify([
      "Panoramic Mountain Views",
      "Radiant Floor Heating",
      "Custom Fireplace",
      "Chef's Pantry",
      "EV Charger Ready",
      "Fenced Yard",
      "Covered Patio",
    ]),
    detailedSpecs: JSON.stringify({
      interior: {
        heating: "Radiant Floor Heating, Forced Air",
        cooling: "Central Air",
        appliances: "Gas Range, Stainless Steel Refrigerator, Dishwasher, Microwave",
        flooring: "Polished Concrete, Engineered Oak",
        fireplace: "Stone Hearth Gas Fireplace",
      },
      parking: {
        totalSpaces: 2,
        garageType: "2-Car Attached Garage",
      },
      construction: {
        style: "Craftsman Modern",
        materials: "Cedar Wood Siding, Natural Stone",
        roof: "Metal Standing Seam",
      },
      utilities: {
        water: "City Water",
        sewer: "Public Sewer",
        greenEnergy: "Solar Panel Prepared Roof",
      },
    }),
    status: "AVAILABLE",
    featured: true,
    images: [
      { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80", alt: "Photo 1" },
      { url: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80", alt: "Photo 2" },
      { url: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80", alt: "Photo 3" },
    ],
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
    description:
      "Classic brick architecture with contemporary interior upgrades. Features refinished oak floors, new architectural roof shingles, and updated master bath amenities.",
    features: JSON.stringify([
      "Hardwood Flooring",
      "Fenced Backyard",
      "Updated Roof (2023)",
      "Formal Dining Room",
    ]),
    detailedSpecs: JSON.stringify({
      interior: {
        heating: "Forced Air",
        cooling: "Central Air",
        appliances: "Range, Refrigerator, Dishwasher",
      },
      parking: {
        totalSpaces: 2,
        garageType: "Detached Garage",
      },
      construction: {
        style: "Tudor Revival",
        materials: "Full Brick Exterior",
      },
    }),
    status: "AVAILABLE",
    featured: false,
    images: [
      { url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80", alt: "Photo 1" },
      { url: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80", alt: "Photo 2" },
    ],
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
