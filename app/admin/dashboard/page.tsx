import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminDashboardClient } from "./AdminDashboardClient";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  // Fetch all admin data
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

  return (
    <AdminDashboardClient
      session={session}
      initialProperties={properties}
      initialSubmissions={submissions}
      initialInquiries={inquiries}
    />
  );
}
