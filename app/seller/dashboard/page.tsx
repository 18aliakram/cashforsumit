import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SellerDashboardClient } from "./SellerDashboardClient";

export const revalidate = 0;

export default async function SellerDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "ADMIN") {
    redirect("/admin/dashboard");
  }

  // Fetch Seller's Submissions, Offers, Conversations, Messages
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

  return <SellerDashboardClient session={session} submissions={submissions} />;
}
