import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, buildNotificationEmail } from "@/lib/email";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const submissionId = searchParams.get("submissionId");

    if (!submissionId) {
      return NextResponse.json({ error: "Submission ID required" }, { status: 400 });
    }

    const conversation = await db.conversation.findFirst({
      where: { submissionId },
      include: {
        messages: {
          include: {
            sender: {
              select: { id: true, firstName: true, lastName: true, role: true },
            },
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ messages: [] });
    }

    return NextResponse.json({ messages: conversation.messages, conversationId: conversation.id });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { submissionId, content } = body;

    if (!submissionId || !content || !content.trim()) {
      return NextResponse.json({ error: "Submission ID and message content required" }, { status: 400 });
    }

    let conversation = await db.conversation.findFirst({
      where: { submissionId },
      include: { submission: { include: { seller: true } } },
    });

    if (!conversation) {
      const submission = await db.sellerSubmission.findUnique({
        where: { id: submissionId },
        include: { seller: true },
      });
      if (!submission) {
        return NextResponse.json({ error: "Submission not found" }, { status: 404 });
      }
      conversation = await db.conversation.create({
        data: {
          sellerId: submission.sellerId,
          submissionId,
        },
        include: { submission: { include: { seller: true } } },
      });
    }

    const message = await db.message.create({
      data: {
        conversationId: conversation.id,
        senderId: session.userId,
        content: content.trim(),
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });

    // Notify recipient via Email
    const isSenderAdmin = session.role === "ADMIN";
    const recipientEmail = isSenderAdmin
      ? conversation.submission.seller.email
      : process.env.ADMIN_NOTIFICATION_EMAIL || "admin@cashforhousessummit.com";

    const recipientName = isSenderAdmin ? conversation.submission.seller.firstName : "Summit Team";

    await sendEmail({
      to: recipientEmail,
      subject: `New Message regarding ${conversation.submission.propertyAddress}`,
      html: buildNotificationEmail({
        title: `New Message from ${session.firstName}`,
        body: `Hello ${recipientName},<br/><br/>You have received a new message regarding property <strong>${conversation.submission.propertyAddress}</strong>:<br/><br/>
               <blockquote style="border-left:3px solid #E88D23; padding-left:12px; font-style:italic; color:#475569;">"${content.trim()}"</blockquote>`,
        ctaText: isSenderAdmin ? "Reply in Seller Dashboard" : "Reply in Admin Portal",
        ctaUrl: isSenderAdmin
          ? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/seller/dashboard`
          : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard`,
      }),
    });

    return NextResponse.json({ success: true, message });
  } catch (error: any) {
    console.error("[Post Message Error]", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
