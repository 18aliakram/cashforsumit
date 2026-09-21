import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { PropertyFilterCatalog } from "@/components/properties/PropertyFilterCatalog";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const revalidate = 0;

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
