import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, buildNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "SELLER") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const body = await req.json();
    const { offerId, action, message } = body; // action: "ACCEPT" | "DECLINE"

    if (!offerId || !["ACCEPT", "DECLINE"].includes(action)) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const offer = await db.offer.findUnique({
      where: { id: offerId },
      include: {
        submission: true,
      },
    });

    if (!offer || offer.submission.sellerId !== session.userId) {
      return NextResponse.json({ error: "Offer not found" }, { status: 404 });
    }

    const newOfferStatus = action === "ACCEPT" ? "ACCEPTED" : "DECLINED";
    const newSubmissionStatus = action === "ACCEPT" ? "ACCEPTED" : "NEGOTIATING";

    // 1. Update Offer Status
    const updatedOffer = await db.offer.update({
      where: { id: offerId },
      data: { status: newOfferStatus },
    });

    // 2. Update Submission Status (do NOT close if declined; set to NEGOTIATING)
    await db.sellerSubmission.update({
      where: { id: offer.submissionId },
      data: { status: newSubmissionStatus },
    });

    // 3. Add automatic message into Conversation if message provided or as auto note
    const conversation = await db.conversation.findFirst({
      where: { submissionId: offer.submissionId },
    });

    if (conversation) {
      const content =
        action === "ACCEPT"
          ? `[System] Seller ${session.firstName} ${session.lastName} has ACCEPTED the cash offer of $${offer.amount.toLocaleString()}. ${
              message ? `Message: "${message}"` : ""
            }`
          : `[System] Seller ${session.firstName} ${session.lastName} has DECLINED the offer of $${offer.amount.toLocaleString()} and requested to continue conversation. ${
              message ? `Message: "${message}"` : ""
            }`;

      await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.userId,
          content,
        },
      });
    }

    // 4. Notify Admin
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@cashforhousessummit.com";
    await sendEmail({
      to: adminEmail,
      subject: `Offer ${newOfferStatus}: ${offer.submission.propertyAddress}`,
      html: buildNotificationEmail({
        title: `Offer ${action === "ACCEPT" ? "Accepted" : "Declined"} by Seller`,
        body: `Seller <strong>${session.firstName} ${session.lastName}</strong> has <strong>${newOfferStatus}</strong> the offer of $${offer.amount.toLocaleString()} for ${
          offer.submission.propertyAddress
        }.<br/><br/>
        ${message ? `<strong>Seller Message:</strong> "${message}"<br/><br/>` : ""}
        ${
          action === "DECLINE"
            ? "The conversation remains active in your admin portal so you can negotiate or send a revised offer."
            : "Please proceed with title and closing coordination."
        }`,
        ctaText: "Open Admin Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard`,
      }),
    });

    return NextResponse.json({ success: true, offer: updatedOffer });
  } catch (error: any) {
    console.error("[Offer Action Error]", error);
    return NextResponse.json({ error: "Failed to update offer" }, { status: 500 });
  }
}
