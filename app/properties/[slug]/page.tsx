import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PropertyDetailClient } from "./PropertyDetailClient";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const revalidate = 0;

interface PropertyPageProps {
  params: { slug: string };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const session = await getSession();

  let property = null;
  try {
    property = await db.property.findUnique({
      where: { slug: params.slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
      },
    });
  } catch (err) {
    console.error("Failed to load property detail", err);
  }

  if (!property) {
    notFound();
  }

  // Parse JSON features array safely
  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(property.features || "[]");
  } catch (e) {
    featuresList = [];
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA]">
      <Navbar userSession={session} />

      <main className="flex-grow py-10">
        <PropertyDetailClient property={property} featuresList={featuresList} />
      </main>

      <Footer />
    </div>
  );
}
