"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Square, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card3D } from "@/components/ui/Card3D";
import { formatCurrency, formatNumber } from "@/lib/utils";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: number;
    address: string;
    city: string;
    state: string;
    bedrooms: number;
    bathrooms: number;
    squareFeet: number;
    propertyType: string;
    status: string;
    images?: Array<{ url: string; alt?: string | null }>;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageUrl =
    property.images && property.images.length > 0
      ? property.images[0].url
      : "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80";

  return (
    <Card3D>
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col justify-between h-full">
        
        {/* Card Header Image */}
        <div className="relative h-60 w-full overflow-hidden bg-slate-900">
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-4 left-4">
            <Badge status={property.status}>{property.status}</Badge>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                {property.propertyType}
              </span>
              <span className="text-2xl font-extrabold text-brand-dark">
                {formatCurrency(property.price)}
              </span>
            </div>

            <h3 className="font-bold text-lg text-brand-dark line-clamp-1 group-hover:text-brand-orange transition-colors">
              {property.title}
            </h3>

            <p className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
              <span className="truncate">{property.address}, {property.city} {property.state}</span>
            </p>
          </div>

          {/* Quick Specs Bar */}
          <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs text-slate-700 font-semibold">
            <div className="flex items-center justify-center gap-1">
              <Bed className="w-4 h-4 text-brand-orange" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Bath className="w-4 h-4 text-brand-orange" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Square className="w-4 h-4 text-brand-orange" />
              <span>{formatNumber(property.squareFeet)} sqft</span>
            </div>
          </div>

          <Link href={`/properties/${property.slug}`} className="block pt-2">
            <Button variant="primary" size="md" className="w-full gap-2 shadow-md">
              <span>View Property Details</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </Card3D>
  );
}
