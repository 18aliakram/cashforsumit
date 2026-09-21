import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setAuthCookie } from "@/lib/auth";
import { sendEmail, buildNotificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, password } = body;

    if (!firstName || !lastName || !email || !phone || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 400 });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await db.user.create({
      data: {
        firstName,
        lastName,
        email: email.toLowerCase(),
        phone,
        passwordHash,
        role: "SELLER",
      },
    });

    // Set HTTP-only Auth Cookie Session
    await setAuthCookie({
      userId: newUser.id,
      email: newUser.email,
      role: "SELLER",
      firstName: newUser.firstName,
      lastName: newUser.lastName,
    });

    // Send Welcome Email
    await sendEmail({
      to: newUser.email,
      subject: "Welcome to Cash for Houses Summit",
      html: buildNotificationEmail({
        title: "Welcome to Your Seller Portal",
        body: `Hello ${firstName},<br/><br/>Thank you for creating your account with Cash for Houses Summit. You can now submit your home details, track valuation reviews, and manage cash offers directly from your secure seller portal.`,
        ctaText: "Go to Seller Dashboard",
        ctaUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/seller/dashboard`,
      }),
    });

    return NextResponse.json({ success: true, user: { id: newUser.id, email: newUser.email, role: newUser.role } });
  } catch (error: any) {
    console.error("[Register Error]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
