import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, buildNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { propertyId, name, email, phone, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json({ error: "Required inquiry fields missing" }, { status: 400 });
    }

    const inquiry = await db.buyerInquiry.create({
      data: {
        propertyId: propertyId || null,
        name,
        email,
        phone,
        message,
        status: "NEW",
      },
      include: {
        property: true,
      },
    });

    // Notify Admin via Email & Database Notification
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@cashforhousessummit.com";
    await sendEmail({
      to: adminEmail,
      subject: `New Buyer Property Inquiry from ${name}`,
      html: buildNotificationEmail({
        title: "New Buyer Inquiry Received",
        body: `<strong>Name:</strong> ${name}<br/>
               <strong>Email:</strong> ${email}<br/>
               <strong>Phone:</strong> ${phone}<br/>
               ${inquiry.property ? `<strong>Property:</strong> ${inquiry.property.title} (${inquiry.property.address})<br/>` : ""}
               <strong>Message:</strong><br/>${message}`,
        ctaText: "Review in Admin Portal",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard`,
      }),
    });

    return NextResponse.json({ success: true, inquiry });
  } catch (error: any) {
    console.error("[Inquiry Error]", error);
    return NextResponse.json({ error: "Failed to process inquiry" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const inquiries = await db.buyerInquiry.findMany({
      include: {
        property: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ inquiries });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }
}
