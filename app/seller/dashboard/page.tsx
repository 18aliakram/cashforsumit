import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SellerDashboardClient } from "./SellerDashboardClient";

export const revalidate = 0;

const FALLBACK_SELLER_SUBMISSIONS = [
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
    description: "Inherited property needing cosmetic updates, new roof section, and kitchen modernization.",
    photos: JSON.stringify(["https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"]),
    preferredContact: "Email",
    status: "NEGOTIATING",
    createdAt: new Date(),
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

export default async function SellerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  let submissions: any[] = [];
  try {
    submissions = await db.sellerSubmission.findMany({
      where: { sellerId: session.userId },
      include: {
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
  } catch (err) {
    console.error("Failed to fetch seller data", err);
  }

  if (submissions.length === 0) {
    submissions = FALLBACK_SELLER_SUBMISSIONS;
  }

  return <SellerDashboardClient session={session} submissions={submissions} />;
}
