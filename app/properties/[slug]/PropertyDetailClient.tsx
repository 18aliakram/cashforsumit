"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Layers,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Mail,
  Maximize2,
  Flame,
  Wind,
  Tv,
  Car,
  Home as HomeIcon,
  Zap,
  Wrench,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { InquiryModal } from "@/components/properties/InquiryModal";
import { PropertyImageLightbox } from "@/components/properties/PropertyImageLightbox";
import { formatCurrency, formatNumber } from "@/lib/utils";

export function PropertyDetailClient({
  property,
  featuresList,
}: {
  property: any;
  featuresList: string[];
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  const images = property.images && property.images.length > 0
    ? property.images
    : [{ url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", alt: property.title }];

  const currentImage = images[activeImageIndex] || images[0];

  // Parse Zillow-style detailedSpecs JSON
  let detailedSpecs: any = {};
  try {
    detailedSpecs = JSON.parse(property.detailedSpecs || "{}");
  } catch (e) {
    detailedSpecs = {};
  }

  const { interior, parking, construction, utilities } = detailedSpecs;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Breadcrumbs */}
      <div className="flex items-center text-xs text-slate-500 gap-2">
        <Link href="/" className="hover:text-brand-dark">Home</Link>
        <span>/</span>
        <Link href="/properties" className="hover:text-brand-dark">Properties</Link>
        <span>/</span>
        <span className="text-brand-dark font-medium truncate">{property.title}</span>
      </div>

      {/* Title & Price Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Badge status={property.status}>{property.status}</Badge>
            <span className="text-xs font-semibold text-brand-orange uppercase tracking-wider">
              {property.propertyType}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-dark">
            {property.title}
          </h1>
          <p className="text-sm text-slate-600 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" />
            <span>{property.address}, {property.city}, {property.state} {property.zip}</span>
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-left md:text-right space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Asking Price</span>
          <p className="text-3xl font-extrabold text-brand-dark">
            {formatCurrency(property.price)}
          </p>
        </div>
      </div>

      {/* Image Gallery Showcase - CLICKABLE TO OPEN ANIMATED LIGHTBOX */}
      <div className="space-y-3">
        <div
          onClick={() => setIsLightboxOpen(true)}
          className="relative h-[380px] sm:h-[500px] w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-lg cursor-pointer group"
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt || property.title}
            fill
            sizes="100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />

          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          
          <div className="absolute top-4 right-4 bg-black/70 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md flex items-center gap-2 group-hover:bg-brand-orange transition-colors">
            <Maximize2 className="w-4 h-4" />
            <span>Click for Fullscreen Gallery</span>
          </div>

          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-md text-xs backdrop-blur-md">
            Photo {activeImageIndex + 1} of {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {images.map((img: any, idx: number) => (
              <button
                key={img.id || idx}
                onClick={() => {
                  setActiveImageIndex(idx);
                  setIsLightboxOpen(true);
                }}
                className={`relative h-20 w-32 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? "border-brand-orange ring-2 ring-brand-orange/30 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="Thumbnail" fill sizes="128px" className="object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Key Specs Bar */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Bedrooms</span>
              <p className="text-xl font-bold text-brand-dark flex items-center justify-center gap-1.5">
                <Bed className="w-5 h-5 text-brand-orange" />
                <span>{property.bedrooms} Beds</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Bathrooms</span>
              <p className="text-xl font-bold text-brand-dark flex items-center justify-center gap-1.5">
                <Bath className="w-5 h-5 text-brand-orange" />
                <span>{property.bathrooms} Baths</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Square Feet</span>
              <p className="text-xl font-bold text-brand-dark flex items-center justify-center gap-1.5">
                <Square className="w-5 h-5 text-brand-orange" />
                <span>{formatNumber(property.squareFeet)} sqft</span>
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold uppercase">Lot Size</span>
              <p className="text-xl font-bold text-brand-dark flex items-center justify-center gap-1.5">
                <Layers className="w-5 h-5 text-brand-orange" />
                <span>{property.lotSize || "N/A"}</span>
              </p>
            </div>
          </div>

          {/* Features Highlights Pills */}
          {featuresList.length > 0 && (
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-orange" />
                <h3 className="text-xl font-bold text-brand-dark">Property Features & Amenities</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {featuresList.map((feat, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 px-3.5 py-2 bg-brand-orange-light text-brand-dark text-xs font-semibold rounded-lg border border-brand-orange/20"
                  >
                    <ShieldCheck className="w-4 h-4 text-brand-orange" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ZILLOW-STYLE CATEGORIZED SPECIFICATIONS */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-brand-dark border-b border-slate-100 pb-3">
              Detailed Property Breakdown
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              
              {/* Category 1: Interior & Appliances */}
              <div className="bg-[#FAFAFA] p-5 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <Flame className="w-4 h-4 text-brand-orange" />
                  <span>Interior & Climate</span>
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div><strong className="text-brand-dark">Heating:</strong> {interior?.heating || "Forced Air"}</div>
                  <div><strong className="text-brand-dark">Cooling:</strong> {interior?.cooling || "Central Air"}</div>
                  <div><strong className="text-brand-dark">Appliances:</strong> {interior?.appliances || "Stainless Steel Suite Included"}</div>
                  <div><strong className="text-brand-dark">Flooring:</strong> {interior?.flooring || "Hardwood, Tile"}</div>
                  {interior?.fireplace && <div><strong className="text-brand-dark">Fireplace:</strong> {interior.fireplace}</div>}
                  {interior?.basement && <div><strong className="text-brand-dark">Basement:</strong> {interior.basement}</div>}
                </div>
              </div>

              {/* Category 2: Parking & Structure */}
              <div className="bg-[#FAFAFA] p-5 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <Car className="w-4 h-4 text-brand-orange" />
                  <span>Parking & Structure</span>
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div><strong className="text-brand-dark">Total Parking Spaces:</strong> {parking?.totalSpaces || property.bedrooms}</div>
                  <div><strong className="text-brand-dark">Garage / Carport:</strong> {parking?.garageType || "Attached Garage"}</div>
                  <div><strong className="text-brand-dark">Home Style:</strong> {construction?.style || property.propertyType}</div>
                  <div><strong className="text-brand-dark">Stories / Levels:</strong> {construction?.stories || "2 Stories"}</div>
                  <div><strong className="text-brand-dark">Year Built:</strong> {property.yearBuilt || "N/A"}</div>
                </div>
              </div>

              {/* Category 3: Construction & Materials */}
              <div className="bg-[#FAFAFA] p-5 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <HomeIcon className="w-4 h-4 text-brand-orange" />
                  <span>Construction & Exterior</span>
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div><strong className="text-brand-dark">Exterior Materials:</strong> {construction?.materials || "Brick / Siding"}</div>
                  <div><strong className="text-brand-dark">Roof:</strong> {construction?.roof || "Architectural Shingle"}</div>
                  <div><strong className="text-brand-dark">Lot Size:</strong> {property.lotSize || "N/A"}</div>
                </div>
              </div>

              {/* Category 4: Utilities & Green Energy */}
              <div className="bg-[#FAFAFA] p-5 rounded-xl border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-sm text-brand-dark flex items-center gap-2">
                  <Zap className="w-4 h-4 text-brand-orange" />
                  <span>Utilities & Energy</span>
                </h4>
                <div className="space-y-2 text-slate-600">
                  <div><strong className="text-brand-dark">Gas / Electric:</strong> {utilities?.gas || "Natural Gas & Electricity Connected"}</div>
                  <div><strong className="text-brand-dark">Water / Sewer:</strong> {utilities?.water || "Public City Water & Sewer"}</div>
                  {utilities?.greenEnergy && <div><strong className="text-brand-dark">Energy Efficiency:</strong> {utilities.greenEnergy}</div>}
                </div>
              </div>

            </div>
          </div>

          {/* Description */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-brand-dark">Full Description</h3>
            <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

        </div>

        {/* Right Sidebar: Lead Action */}
        <div className="lg:col-span-4">
          <div className="sticky top-24 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-lg space-y-6">
            <div className="space-y-2 border-b border-slate-100 pb-4">
              <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">Interested in this property?</span>
              <h3 className="text-xl font-bold text-brand-dark">Schedule a Tour or Inquire</h3>
              <p className="text-xs text-slate-500">
                Contact Cash for Houses Summit directly regarding availability, disclosures, or purchase options.
              </p>
            </div>

            <Button
              variant="primary"
              size="lg"
              onClick={() => setIsInquiryOpen(true)}
              className="w-full gap-2 shadow-md"
            >
              <Mail className="w-5 h-5" />
              <span>I&apos;m Interested</span>
            </Button>

            <div className="pt-2 text-xs text-slate-500 space-y-2 border-t border-slate-100">
              <p className="font-semibold text-brand-dark">Direct Summit Buyer Guarantee:</p>
              <p>• Transparent documentation & fast response</p>
              <p>• Direct communications with property acquisitions</p>
            </div>
          </div>
        </div>

      </div>

      {/* FULL-SCREEN ANIMATED LIGHTBOX */}
      <PropertyImageLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        currentIndex={activeImageIndex}
        onIndexChange={(idx) => setActiveImageIndex(idx)}
        propertyTitle={property.title}
      />

      {/* Inquiry Modal */}
      <InquiryModal
        isOpen={isInquiryOpen}
        onClose={() => setIsInquiryOpen(false)}
        property={{
          id: property.id,
          title: property.title,
          address: property.address,
          city: property.city,
          state: property.state,
        }}
      />
    </div>
  );
}
