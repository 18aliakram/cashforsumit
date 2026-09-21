import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendEmail, buildNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Authentication required to submit property" }, { status: 401 });
    }

    const body = await req.json();
    const {
      propertyAddress,
      city,
      state,
      zip,
      propertyType,
      bedrooms,
      bathrooms,
      squareFeet,
      lotSize,
      yearBuilt,
      occupancy,
      condition,
      description,
      photos,
      preferredContact,
      questionnaireData,
    } = body;

    if (!propertyAddress || !city || !state || !zip || !propertyType || !bedrooms || !bathrooms || !condition) {
      return NextResponse.json({ error: "Required property submission fields missing" }, { status: 400 });
    }

    const submission = await db.sellerSubmission.create({
      data: {
        sellerId: session.userId,
        propertyAddress,
        city,
        state,
        zip,
        propertyType,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseFloat(bathrooms),
        squareFeet: squareFeet ? parseInt(squareFeet) : null,
        lotSize: lotSize || null,
        yearBuilt: yearBuilt ? parseInt(yearBuilt) : null,
        occupancy: occupancy || null,
        condition,
        description: description || null,
        photos: JSON.stringify(photos || []),
        preferredContact: preferredContact || "Either",
        questionnaireData: typeof questionnaireData === "string" ? questionnaireData : JSON.stringify(questionnaireData || {}),
        status: "NEW",
      },
    });

    // Create initial Conversation thread for Seller <-> Admin
    const conversation = await db.conversation.create({
      data: {
        sellerId: session.userId,
        submissionId: submission.id,
      },
    });

    // Notify Admin via Email
    const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || "admin@cashforhousessummit.com";
    await sendEmail({
      to: adminEmail,
      subject: `New Opendoor Seller Valuation Submission: ${propertyAddress}, ${city} ${state}`,
      html: buildNotificationEmail({
        title: "New Home Seller Submission Received",
        body: `A new property submission has been created by ${session.firstName} ${session.lastName}.<br/><br/>
               <strong>Address:</strong> ${propertyAddress}, ${city}, ${state} ${zip}<br/>
               <strong>Type:</strong> ${propertyType} | ${bedrooms} Beds | ${bathrooms} Baths<br/>
               <strong>Condition:</strong> ${condition}<br/>
               <strong>Contact Preference:</strong> ${preferredContact}`,
        ctaText: "Review Submission in Admin Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/dashboard`,
      }),
    });

    // Notify Seller via Email
    await sendEmail({
      to: session.email,
      subject: "Property Submission Received - Cash for Houses Summit",
      html: buildNotificationEmail({
        title: "Your Property Submission is Received",
        body: `Hello ${session.firstName},<br/><br/>We have received your property details for <strong>${propertyAddress}</strong>. Our underwriting team is currently evaluating the information. We aim to provide an offer within 48 hours or less.<br/><br/>You can monitor your submission status and communicate directly with our team from your seller dashboard.`,
        ctaText: "View Seller Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/seller/dashboard`,
      }),
    });

    return NextResponse.json({ success: true, submissionId: submission.id });
  } catch (error: any) {
    console.error("[Submission API Error]", error);
    return NextResponse.json({ error: "Failed to submit property" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const whereClause = session.role === "ADMIN" ? {} : { sellerId: session.userId };

    const submissions = await db.sellerSubmission.findMany({
      where: whereClause,
      include: {
        seller: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true },
        },
        offers: {
          orderBy: { createdAt: "desc" },
        },
        conversations: {
          include: {
            messages: {
              include: {
                sender: { select: { id: true, firstName: true, role: true } },
              },
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ submissions });
  } catch (error: any) {
    console.error("[Submission GET Error]", error);
    return NextResponse.json({ error: "Failed to fetch submissions" }, { status: 500 });
  }
}
