"use client";

import React, { useState } from "react";
import { Search, Filter } from "lucide-react";
import { PropertyCard } from "@/components/properties/PropertyCard";

export function PropertyFilterCatalog({ initialProperties }: { initialProperties: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("ALL");
  const [selectedStatus, setSelectedStatus] = useState("AVAILABLE");

  const filteredProperties = initialProperties.filter((prop) => {
    const matchesSearch =
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.address.toLowerCase().includes(search.toLowerCase()) ||
      prop.city.toLowerCase().includes(search.toLowerCase()) ||
      prop.state.toLowerCase().includes(search.toLowerCase()) ||
      prop.zip.includes(search);

    const matchesType = selectedType === "ALL" || prop.propertyType === selectedType;
    const matchesStatus = selectedStatus === "ALL" || prop.status === selectedStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Keyword Search */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by city, ZIP, address, or property title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
            />
          </div>

          {/* Property Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="ALL">All Property Types</option>
              <option value="Single Family">Single Family</option>
              <option value="Townhouse">Townhouse</option>
              <option value="Condo">Condo</option>
              <option value="Multi-Family">Multi-Family</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-brand-dark focus:bg-white focus:ring-2 focus:ring-brand-orange focus:outline-none"
            >
              <option value="ALL">All Listing Statuses</option>
              <option value="AVAILABLE">Available Now</option>
              <option value="PENDING">Pending Under Contract</option>
              <option value="SOLD">Sold Catalog</option>
            </select>
          </div>

        </div>
      </div>

      {/* Property Cards Grid */}
      {filteredProperties.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <Filter className="w-10 h-10 text-brand-orange mx-auto" />
          <h3 className="text-xl font-bold text-brand-dark">No Properties Match Criteria</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search terms or filters to view available property listings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((prop) => (
            <PropertyCard key={prop.id} property={prop} />
          ))}
        </div>
      )}

    </div>
  );
}
