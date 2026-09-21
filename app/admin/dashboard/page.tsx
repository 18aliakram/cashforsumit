import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";

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
    yearBuilt: 2021,
    description: "Contemporary Craftsman featuring cedar accents and radiant heated floors.",
    features: JSON.stringify(["Mountain Views", "Radiant Floor Heating", "EV Charger Ready"]),
    detailedSpecs: JSON.stringify({ interior: { heating: "Radiant Floor Heating" } }),
    status: "AVAILABLE",
    featured: true,
    images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80" }],
  },
];

const FALLBACK_SUBMISSIONS = [
  {
    id: "sub-1",
    sellerId: "seller-user-id-1",
    propertyAddress: "742 Evergreen Terrace",
    city: "Springfield",
    state: "IL",
    zip: "62704",
    propertyType: "Single Family",
    bedrooms: 3,
    bathrooms: 2.0,
    squareFeet: 1750,
    condition: "Needs Repairs",
    description: "Inherited property needing cosmetic updates and kitchen modernization.",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"]),
    preferredContact: "Email",
    status: "NEGOTIATING",
    createdAt: new Date(),
    seller: {
      id: "seller-user-id-1",
      firstName: "Marcus",
      lastName: "Vance",
      email: "seller@example.com",
      phone: "(555) 234-5678",
    },
    offers: [
      {
        id: "offer-1",
        amount: 195000,
        status: "PENDING",
        message: "Revised Offer: $195,000 net to seller with flexible closing.",
        createdAt: new Date(),
      },
    ],
    conversations: [
      {
        id: "conv-1",
        label: "NEGOTIATING",
        messages: [
          {
            id: "msg-1",
            senderId: "admin-user-id",
            content: "Hello Marcus, we have issued an updated offer of $195,000 net to you.",
            createdAt: new Date(),
            sender: { id: "admin-user-id", firstName: "Summit", role: "ADMIN" },
          },
        ],
      },
    ],
  },
];

const FALLBACK_INQUIRIES = [
  {
    id: "inq-1",
    name: "David Miller",
    email: "dmiller@example.com",
    phone: "(555) 345-6789",
    message: "Hi, I would like to schedule a walk-through for 1428 Elmwood Terrace this Saturday.",
    status: "NEW",
    createdAt: new Date(),
    property: {
      id: "prop-1",
      title: "Modern Colonial Residence in Fairview Heights",
      address: "1428 Elmwood Terrace",
    },
  },
];

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  let properties: any[] = [];
  let submissions: any[] = [];
  let inquiries: any[] = [];

  try {
    properties = await db.property.findMany({
      include: { images: { orderBy: { sortOrder: "asc" } } },
      orderBy: { createdAt: "desc" },
    });

    submissions = await db.sellerSubmission.findMany({
      include: {
        seller: true,
        offers: { orderBy: { createdAt: "desc" } },
        conversations: {
          include: {
            messages: {
              include: { sender: { select: { id: true, firstName: true, role: true } } },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    inquiries = await db.buyerInquiry.findMany({
      include: { property: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("Failed to load admin data", err);
  }

  if (properties.length === 0) properties = FALLBACK_PROPERTIES;
  if (submissions.length === 0) submissions = FALLBACK_SUBMISSIONS;
  if (inquiries.length === 0) inquiries = FALLBACK_INQUIRIES;

  return (
    <AdminDashboardClient
      session={session}
      initialProperties={properties}
      initialSubmissions={submissions}
      initialInquiries={inquiries}
    />
  );
}
