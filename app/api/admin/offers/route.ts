import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, buildNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Admin authorization required" }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId, amount, message, internalNotes, expirationDate } = body;

    if (!submissionId || !amount || isNaN(parseFloat(amount))) {
      return NextResponse.json({ error: "Valid submission ID and offer amount are required" }, { status: 400 });
    }

    const submission = await db.sellerSubmission.findUnique({
      where: { id: submissionId },
      include: { seller: true },
    });

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    // Mark previous PENDING offers as SUPERSEDED
    await db.offer.updateMany({
      where: { submissionId, status: "PENDING" },
      data: { status: "SUPERSEDED" },
    });

    // Create New Offer
    const offer = await db.offer.create({
      data: {
        submissionId,
        amount: parseFloat(amount),
        message: message || null,
        internalNotes: internalNotes || null,
        expirationDate: expirationDate ? new Date(expirationDate) : null,
        status: "PENDING",
      },
    });

    // Update Submission Status to OFFER_MADE
    await db.sellerSubmission.update({
      where: { id: submissionId },
      data: { status: "OFFER_MADE" },
    });

    // Add notification record for seller
    await db.notification.create({
      data: {
        userId: submission.sellerId,
        type: "OFFER_RECEIVED",
        title: "New Cash Offer Received",
        message: `Cash for Houses Summit has issued a cash offer of $${parseFloat(amount).toLocaleString()} for ${submission.propertyAddress}.`,
        link: "/seller/dashboard",
      },
    });

    // Send Email to Seller
    await sendEmail({
      to: submission.seller.email,
      subject: `Cash Offer Received for ${submission.propertyAddress}`,
      html: buildNotificationEmail({
        title: "New Cash Offer for Your Home",
        body: `Hello ${submission.seller.firstName},<br/><br/>
               Cash for Houses Summit has evaluated your property at <strong>${submission.propertyAddress}</strong> and issued a formal cash offer:<br/><br/>
               <div style="background-color:#F8FAFC; padding:16px; text-align:center; border-radius:6px; border:1px solid #E2E8F0; margin:16px 0;">
                 <span style="font-size:13px; color:#64748B; text-transform:uppercase;">Net Cash Offer to Seller</span><br/>
                 <strong style="font-size:28px; color:#1E2022;">$${parseFloat(amount).toLocaleString()}</strong>
               </div>
               ${message ? `<p><strong>Note from our team:</strong> "${message}"</p>` : ""}
               Log into your secure portal to review options, accept, or speak with our team.`,
        ctaText: "Review Cash Offer",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/seller/dashboard`,
      }),
    });

    return NextResponse.json({ success: true, offer });
  } catch (error: any) {
    console.error("[Admin Create Offer Error]", error);
    return NextResponse.json({ error: "Failed to create offer" }, { status: 500 });
  }
}
